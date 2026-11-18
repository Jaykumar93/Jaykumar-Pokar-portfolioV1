# Jaykumar Pokar, Portfolio

Single-page developer portfolio built with Next.js (App Router). Live at [jaykumarpokar.netlify.app](https://jaykumarpokar.netlify.app).

## Design

- **Colour encodes the four layers** of the stack: Data (blue), Services (ochre), Interface (teal) and AI (rose). The same four colours appear in the layer stack, the toolkit, the request trace and the project cards. Primary actions are neutral ink.
- Success and failure states are always green and red, paired with a check or cross.
- Light and dark themes (follows the system, with a toggle). Colour ramps were generated in OKLCH and contrast was measured.
- Glass is used only on the floating nav.
- The original design mockup lives in [`design/portfolio-mockup.html`](design/portfolio-mockup.html).

## Stack

- **Framework:** Next.js 16 (App Router, Turbopack), React 19, TypeScript
- **Styling:** plain CSS tokens in `src/app/globals.css` (no UI library), fonts via `next/font` (Familjen Grotesk, Geist, Geist Mono)
- **Content:** typed data modules in `src/data/`, no CMS
- **Contact form:** [Web3Forms](https://web3forms.com), client-side POST, no backend needed
- **Deployment:** Netlify, auto-deploys from `master`

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Environment variables

Copy `.env.local.example` to `.env.local` and add a free [Web3Forms](https://web3forms.com) access key so the contact form can send:

```
NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY=your-key-here
```

Add the same variable in your deploy host's environment settings, since it is baked in at build time.

## Project structure

```
src/
  app/            layout (fonts, theme init), page, globals.css (tokens + styles)
  components/
    chrome/       nav, theme toggle, command menu (Ctrl K), toast, progress bar, footer
    hero/         hero and the interactive "Ask me" panel
    sections/     metrics
    about/        bio, story steps, draggable layer stack, principles
    projects/     accordion, project visuals, case study overlay
    engineering/  interactive explainers (rules vs AI, retrieval, offline-first, trace, cache, lock, scan)
    experience/   scroll-driven timeline
    toolkit/      grouped, filterable skills
    contact/      contact form
    providers/    UI context (case study, toast, command menu, cross-section navigation)
  data/           profile, projects, jobs, skills, about, ask, engineering
  hooks/, lib/    small shared helpers
public/
  resume.pdf      the downloadable résumé
  media/cursus/   real Cursus screenshots and promo video
design/           the approved design mockup
```

## Notes

- Projects open as a compact accordion; each has a full case study overlay.
- Cursus uses real app screenshots and a 20 second promo video. The Connect & Sell and Diet Planner visuals are illustrative recreations.
- Timings in the Engineering explainers are illustrative.
- Respects `prefers-reduced-motion`.
