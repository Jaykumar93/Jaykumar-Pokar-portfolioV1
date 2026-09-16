# Jaykumar Pokar — Portfolio

Single-page personal portfolio built with Next.js (App Router) and React Three Fiber. Live at [jaykumarpokar.netlify.app](https://jaykumarpokar.netlify.app).

## Stack

- **Framework:** Next.js 16 (App Router, Turbopack), React 19, TypeScript
- **3D:** react-three-fiber + drei — the liquid-glass hero object (`src/components/three/LiquidBall.tsx`), a physically-based draggable/splittable blob with `MeshTransmissionMaterial` and an HDRI environment
- **Styling:** CSS Modules, hand-rolled (no component library)
- **Content:** resume/project data is plain TypeScript objects in `src/data/` — no CMS
- **Contact form:** [Web3Forms](https://web3forms.com) (client-side POST, no backend needed — works identically on Vercel/Netlify/any static host)
- **Deployment:** Netlify, auto-deploys from `master`

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Environment variables

Copy `.env.local.example` to `.env.local` and fill in a free [Web3Forms](https://web3forms.com) access key (just enter your email on their site — no account needed) for the contact form to actually send:

```
NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY=your-key-here
```

Also add the same variable in your deploy host's environment settings (Vercel/Netlify project settings) before deploying, since it's baked in at build time.

## Project structure

```
src/
  app/
    page.tsx           # the entire site — hero, about, toolkit, experience, projects, contact
    page.module.css     # styles for page.tsx
    layout.tsx          # root layout, metadata
    icon.tsx             # dynamically generated favicon (JP monogram)
    apple-icon.tsx        # dynamically generated iOS home-screen icon
  components/
    PrototypeNav.tsx     # fixed nav bar with eased smooth-scroll section jumps
    SocialRail.tsx        # side social icon rail
    ParallaxShapes.tsx     # decorative background shapes
    ContactForm.tsx         # Web3Forms-backed contact form
    three/LiquidBall.tsx     # the 3D hero object
    ui/
      ScrambleText.tsx        # Matrix-style character-decode text effect
      LoadingScreen.tsx        # branded preloader shown until 3D assets + fonts are ready
      ProjectModal.tsx          # click-to-open project detail popup
      Reveal.tsx                # scroll-triggered fade/rise wrapper
      ArrowButton.tsx, CountUp.tsx, SectionLabel.tsx
  data/
    resume.ts             # experience, skills, summary — also the source for the downloadable resume text
    projects.ts             # portfolio project cards (bullets, details, stack, links, sub-projects)
  lib/
    seo.ts                  # site metadata config (name, title, description, canonical URL)
    fonts.ts                  # next/font setup
    skillIcons.tsx              # maps skill names to react-icons components
public/
  resume.pdf               # the downloadable resume (regenerated from ../resume/, see below)
```

## Notable implementation details

- **Loading screen → hero handoff:** the hero's name/title text doesn't start its scramble-in animation until the `LoadingScreen` component's exit transition finishes (gated via a `pageReady` state lifted to `Home`), so the decode effect is always the first thing visible rather than playing out invisibly behind the loader.
- **Nav smooth-scroll:** custom eased `requestAnimationFrame` scroll (not `scroll-behavior: smooth`) so the speed/easing is consistent across browsers; sections have `scroll-margin-top` so the fixed nav never overlaps the landing point.
- **Project modals:** `projects.ts` has both `bullets` (short teasers for the hover-preview card) and `details` (full write-ups for the click-to-open modal) — deliberately different content so the modal doesn't just repeat the card.

## Related

- **Resume source** (the actual resume.txt / .docx / .pdf and the build pipeline that generates them): see the separate `resume` repo — `public/resume.pdf` in this repo is a copy of its output, manually re-synced after resume edits.
