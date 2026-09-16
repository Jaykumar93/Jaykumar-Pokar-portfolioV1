"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { MeshTransmissionMaterial, Environment } from "@react-three/drei";
import * as THREE from "three";

const SEGMENTS = 56;
const NECK_RADIUS = 0.42; // tube thickness of the short stub left on the main body
const TIP_SOFTEN = 0.3; // how far past the grabbed point the stub tapers to a point
const BASE_SOFTEN = 0.4; // how smoothly the stub blends back into the body
const DRAG_EASE = 0.35; // how quickly the pulled point catches up to the cursor
const DETACH_DISTANCE = 0.4; // pull length at which a separate droplet pinches off and starts following the cursor
const DROPLET_DURATION = 0.55; // seconds for the droplet to fly back to its origin and merge in, once released
const SPRING_K = 140; // return stiffness once released — higher = snappier
const SPRING_DAMPING = 11; // lower = more jiggle/overshoot before it settles
const HOME_POSITION = new THREE.Vector3(1.7, 0.1, 0);
const EDGE_DROP_SIZE = 0.12; // droplet size when grabbed right at the silhouette edge
const CENTER_DROP_SIZE = 0.32; // droplet size when grabbed dead-on facing the camera

// A cheap, seam-free "noise": a few offset sine waves sampled by the vertex's
// own position, so the bump pattern is continuous across the whole closed
// surface with no visible tiling or pole artifacts.
function blobRadius(x: number, y: number, z: number) {
  const n =
    Math.sin(x * 3.1 + z * 1.7) * 0.5 +
    Math.sin(y * 4.3 + x * 2.1 + 1.3) * 0.35 +
    Math.sin(z * 2.7 + y * 3.9 + 2.6) * 0.3;
  return 1 + n * 0.16;
}

function smoothstep(t: number) {
  const c = Math.max(0, Math.min(1, t));
  return c * c * (3 - 2 * c);
}

/**
 * A draggable liquid-glass blob, parked on the right side of the hero. It
 * stays put — only rotation is ambient/automatic, position never drifts.
 * Its rest shape is an irregular, permanently lumpy surface rather than a
 * perfect sphere. Grab any point and pull: past a short stretch, that part
 * pinches off into its own small droplet that follows the cursor directly
 * for as long as you hold, while the main body keeps just a short stub
 * toward the pinch point. Let go and the droplet flies back to the exact
 * spot it came from and merges in, while the main body's stub springs back
 * with a damped physical jiggle instead of a flat ease.
 */
export function LiquidBall() {
  const groupRef = useRef<THREE.Group>(null);
  const meshRef = useRef<THREE.Mesh>(null);
  const dropletRef = useRef<THREE.Mesh>(null);
  const lightRef = useRef<THREE.PointLight>(null);
  const { camera } = useThree();

  const geometry = useMemo(() => new THREE.SphereGeometry(1, SEGMENTS, SEGMENTS), []);
  const basePositions = useRef<Float32Array | null>(null);
  const velocities = useRef<Float32Array | null>(null);

  useEffect(() => {
    const posAttr = geometry.attributes.position as THREE.BufferAttribute;
    const arr = posAttr.array as Float32Array;
    for (let i = 0; i < arr.length; i += 3) {
      const x = arr[i];
      const y = arr[i + 1];
      const z = arr[i + 2];
      const r = blobRadius(x, y, z);
      arr[i] = x * r;
      arr[i + 1] = y * r;
      arr[i + 2] = z * r;
    }
    posAttr.needsUpdate = true;
    geometry.computeVertexNormals();
    basePositions.current = arr.slice();
    velocities.current = new Float32Array(arr.length);
  }, [geometry]);

  const drag = useRef({
    active: false,
    detached: false,
    grabLocal: new THREE.Vector3(),
    currentLocal: new THREE.Vector3(),
    targetLocal: new THREE.Vector3(),
    // How "front-on" the grabbed point was (1 = grabbed dead-center facing
    // the camera, 0 = grabbed right at the silhouette edge) plus a random
    // multiplier — both fixed at grab time, together they size the droplet:
    // edge grabs pinch off small, center grabs pull off a bigger blob, with
    // some variation each time either way.
    grabFacing: 0,
    sizeRand: 1,
  });
  // "returning" is true only during the fly-back-and-merge animation after
  // release; while dragging and detached, the droplet just tracks the
  // cursor directly every frame (see useFrame).
  const droplet = useRef({ returning: false, t: 0, pos: new THREE.Vector3(), scale: 0 });
  const mainScale = useRef(1);

  const raycaster = useMemo(() => new THREE.Raycaster(), []);
  const dragPlane = useMemo(() => new THREE.Plane(), []);

  useEffect(() => {
    function toNDC(clientX: number, clientY: number) {
      return new THREE.Vector2((clientX / window.innerWidth) * 2 - 1, -(clientY / window.innerHeight) * 2 + 1);
    }

    function onDown(e: PointerEvent) {
      const mesh = meshRef.current;
      if (!mesh) return;
      raycaster.setFromCamera(toNDC(e.clientX, e.clientY), camera);
      const hit = raycaster.intersectObject(mesh, false)[0];
      if (!hit) return;

      const local = mesh.worldToLocal(hit.point.clone());
      drag.current.active = true;
      drag.current.detached = false;
      drag.current.grabLocal.copy(local);
      drag.current.targetLocal.copy(local);
      drag.current.currentLocal.copy(local);
      droplet.current.returning = false;

      // How front-on the grab was: 1 = facing the camera (screen-center of
      // the blob), 0 = grazing angle at the silhouette edge.
      const localCamPos = mesh.worldToLocal(camera.position.clone());
      const facing = local.clone().normalize().dot(localCamPos.normalize());
      drag.current.grabFacing = Math.max(0, Math.min(1, facing));
      drag.current.sizeRand = 0.8 + Math.random() * 0.4;

      const normal = new THREE.Vector3();
      camera.getWorldDirection(normal).negate();
      dragPlane.setFromNormalAndCoplanarPoint(normal, hit.point);
    }

    function onMove(e: PointerEvent) {
      if (!drag.current.active || !meshRef.current) return;
      const ndc = toNDC(e.clientX, e.clientY);
      raycaster.setFromCamera(ndc, camera);
      const hitPoint = new THREE.Vector3();
      if (raycaster.ray.intersectPlane(dragPlane, hitPoint)) {
        drag.current.targetLocal.copy(meshRef.current.worldToLocal(hitPoint));
      }
    }

    function onUp() {
      drag.current.active = false;
    }

    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    return () => {
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };
  }, [camera, raycaster, dragPlane]);

  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.033);
    const group = groupRef.current;
    if (group) {
      // Position is fixed — only rotation is ambient.
      group.rotation.y += 0.28 * dt;
      group.rotation.x += 0.09 * dt;

      // While part of it is off as a droplet, the main body reads as
      // having a little less volume — it eases back to full size only
      // once that droplet has fully flown home and merged back in.
      const scaleTarget = drag.current.detached ? 0.88 : 1;
      mainScale.current += (scaleTarget - mainScale.current) * 0.08;
      group.scale.setScalar(0.95 * mainScale.current);

      if (lightRef.current) {
        const lt = state.clock.elapsedTime * 0.4;
        lightRef.current.position.set(HOME_POSITION.x + Math.cos(lt) * 2.4, 1.2 + Math.sin(lt * 0.7) * 1.2, Math.sin(lt) * 2.4);
      }
    }

    const mesh = meshRef.current;
    const base = basePositions.current;
    const vel = velocities.current;
    if (!mesh || !base || !vel) return;
    const posAttr = mesh.geometry.attributes.position as THREE.BufferAttribute;
    const arr = posAttr.array as Float32Array;

    drag.current.currentLocal.lerp(drag.current.targetLocal, DRAG_EASE);
    const active = drag.current.active;
    const rawPullX = drag.current.currentLocal.x - drag.current.grabLocal.x;
    const rawPullY = drag.current.currentLocal.y - drag.current.grabLocal.y;
    const rawPullZ = drag.current.currentLocal.z - drag.current.grabLocal.z;
    const gx = drag.current.grabLocal.x;
    const gy = drag.current.grabLocal.y;
    const gz = drag.current.grabLocal.z;
    const rawPullLen = Math.sqrt(rawPullX * rawPullX + rawPullY * rawPullY + rawPullZ * rawPullZ);

    if (active && rawPullLen > DETACH_DISTANCE) {
      drag.current.detached = true;
    }
    const dropSize = (EDGE_DROP_SIZE + (CENTER_DROP_SIZE - EDGE_DROP_SIZE) * smoothstep(drag.current.grabFacing)) * drag.current.sizeRand;

    // The MAIN body's own pull is clamped to DETACH_DISTANCE — past that
    // point a separate droplet takes over (below), so the body never
    // stretches further, it just keeps a short stub toward the pinch point.
    let pullX = rawPullX;
    let pullY = rawPullY;
    let pullZ = rawPullZ;
    if (drag.current.detached && rawPullLen > 0.0001) {
      const clampScale = Math.min(rawPullLen, DETACH_DISTANCE) / rawPullLen;
      pullX *= clampScale;
      pullY *= clampScale;
      pullZ *= clampScale;
    }

    const pullLenSq = pullX * pullX + pullY * pullY + pullZ * pullZ;
    const hasPull = active && pullLenSq > 0.0001;
    let dirX = 0;
    let dirY = 0;
    let dirZ = 0;
    let pullLen = 0;
    if (hasPull) {
      pullLen = Math.sqrt(pullLenSq);
      const inv = 1 / pullLen;
      dirX = pullX * inv;
      dirY = pullY * inv;
      dirZ = pullZ * inv;
    }

    for (let i = 0; i < arr.length; i += 3) {
      const ox = base[i];
      const oy = base[i + 1];
      const oz = base[i + 2];
      let nx = ox;
      let ny = oy;
      let nz = oz;

      if (hasPull) {
        const dx = ox - gx;
        const dy = oy - gy;
        const dz = oz - gz;
        // Cylindrical coordinates around the pull axis: how far along the
        // pull (axial) vs. how far off to the side of it (radial) — a
        // stretched liquid finger is narrow radially and long axially,
        // not a bump that grows uniformly in every direction.
        const axial = dx * dirX + dy * dirY + dz * dirZ;
        const radialSq = Math.max(0, dx * dx + dy * dy + dz * dz - axial * axial);
        const radial = Math.sqrt(radialSq);

        const radialWeight = smoothstep(1 - radial / NECK_RADIUS);
        const tipOvershoot = Math.max(0, axial - pullLen);
        const tipWeight = smoothstep(1 - tipOvershoot / TIP_SOFTEN);
        const baseWeight = smoothstep((axial + BASE_SOFTEN) / BASE_SOFTEN);
        const weight = radialWeight * tipWeight * baseWeight;

        nx = ox + pullX * weight;
        ny = oy + pullY * weight;
        nz = oz + pullZ * weight;
      }

      if (active) {
        // Directly controlled while dragging — snappy, no bounce.
        arr[i] += (nx - arr[i]) * 0.55;
        arr[i + 1] += (ny - arr[i + 1]) * 0.55;
        arr[i + 2] += (nz - arr[i + 2]) * 0.55;
        vel[i] = vel[i + 1] = vel[i + 2] = 0;
      } else {
        // Released: a damped spring pulls each vertex home, with just
        // enough underdamping to jiggle and settle like real liquid
        // surface tension rather than easing flatly back into shape.
        const ax = -SPRING_K * (arr[i] - nx) - SPRING_DAMPING * vel[i];
        const ay = -SPRING_K * (arr[i + 1] - ny) - SPRING_DAMPING * vel[i + 1];
        const az = -SPRING_K * (arr[i + 2] - nz) - SPRING_DAMPING * vel[i + 2];
        vel[i] += ax * dt;
        vel[i + 1] += ay * dt;
        vel[i + 2] += az * dt;
        arr[i] += vel[i] * dt;
        arr[i + 1] += vel[i + 1] * dt;
        arr[i + 2] += vel[i + 2] * dt;
      }
    }
    posAttr.needsUpdate = true;
    mesh.geometry.computeVertexNormals();

    // Droplet: once the pull passes DETACH_DISTANCE it becomes its own
    // little ball and tracks the cursor directly for as long as you keep
    // dragging; letting go flies it back to the exact spot it pinched off
    // from and shrinks it away — the "reunites with the ball" half.
    const drop = dropletRef.current;
    if (drop) {
      if (active && drag.current.detached) {
        droplet.current.returning = false;
        droplet.current.pos.set(gx + rawPullX, gy + rawPullY, gz + rawPullZ);
        droplet.current.scale = dropSize;
        drop.position.copy(droplet.current.pos);
        drop.scale.setScalar(droplet.current.scale);
        drop.visible = true;
      } else if (drag.current.detached) {
        if (!droplet.current.returning) {
          droplet.current.returning = true;
          droplet.current.t = 0;
        }
        droplet.current.t = Math.min(1, droplet.current.t + dt / DROPLET_DURATION);
        const ease = droplet.current.t * droplet.current.t;
        droplet.current.pos.lerp(new THREE.Vector3(gx, gy, gz), 0.22);
        droplet.current.scale = dropSize * (1 - ease);
        drop.position.copy(droplet.current.pos);
        drop.scale.setScalar(Math.max(0, droplet.current.scale));
        drop.visible = droplet.current.t < 1 && droplet.current.scale > 0.005;
        if (droplet.current.t >= 1) {
          drag.current.detached = false;
          droplet.current.returning = false;
          drop.visible = false;
        }
      } else {
        drop.visible = false;
      }
    }
  });

  return (
    <>
      <Environment preset="city" />
      <ambientLight intensity={0.5} />
      <directionalLight position={[4, 4, 2]} intensity={1} />
      <pointLight ref={lightRef} intensity={6} color="#ff4423" distance={7} />
      <group ref={groupRef} position={HOME_POSITION}>
        <mesh ref={meshRef} geometry={geometry}>
          <MeshTransmissionMaterial
            thickness={0.6}
            roughness={0.1}
            transmission={1}
            ior={1.3}
            chromaticAberration={0.05}
            anisotropy={0.1}
            distortion={0.15}
            distortionScale={0.3}
            temporalDistortion={0.1}
            color="#eaf2ff"
            background={new THREE.Color("#12161d")}
          />
        </mesh>
        <mesh ref={dropletRef} visible={false}>
          <sphereGeometry args={[1, 24, 24]} />
          <MeshTransmissionMaterial
            thickness={0.6}
            roughness={0.1}
            transmission={1}
            ior={1.3}
            chromaticAberration={0.05}
            anisotropy={0.1}
            distortion={0.15}
            distortionScale={0.3}
            temporalDistortion={0.1}
            color="#eaf2ff"
            background={new THREE.Color("#12161d")}
          />
        </mesh>
      </group>
    </>
  );
}
