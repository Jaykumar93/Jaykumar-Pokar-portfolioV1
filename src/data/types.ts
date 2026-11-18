export type LayerKey = 0 | 1 | 2 | 3; // 0 Data, 1 Services, 2 Interface, 3 AI

export interface SkillGroup {
  cat: 'Languages' | 'Backend' | 'Frontend' | 'Data' | 'AI' | 'Tools';
  group: string;
  items: string[];
}
export interface JobGroup { name: string; items: string[] }
export interface Job {
  role: string; company: string; location: string; from: string; to: string; current: boolean;
  metrics: { value: string; label: string }[];
  groups: JobGroup[];
}
export interface SubProject { name: string; status: string; vis?: ProjectVisual; desc: string; details: string[] }
export type ProjectVisual = 'cursus' | 'platform' | 'diet' | 'dash';
export interface Project {
  name: string; former?: string; tag: string; status: string; vis: ProjectVisual;
  desc: string; line: string; bullets: string[]; details: string[]; stack: string[];
  flow: [string, string][]; subs?: SubProject[]; layers: LayerKey[]; role: string;
  problem: string; built: string; result: string; facts: [string, string][];
  metric: [string, string]; link?: string; docs?: string; docsLabel?: string;
  gallery?: [string, string][]; video?: { src: string; poster: string };
}
