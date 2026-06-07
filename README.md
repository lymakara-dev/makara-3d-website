# Ly Makara — 3D Portfolio

> Personal portfolio site built with React, Three.js, and a custom NOVA dark design system. Features a live WebGL particle background, an interactive 3D scene, and scroll-driven animations.

[![Deploy](https://img.shields.io/badge/Deployed_on-Cloudflare_Pages-F38020?logo=cloudflare&logoColor=white)](https://lymakara-dev.pages.dev)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)](https://react.dev)
[![Three.js](https://img.shields.io/badge/Three.js-r182-black?logo=threedotjs)](https://threejs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com)

---

## Overview

A fully custom 3D portfolio with zero template dependencies. The visual identity is built around the **NOVA dark aesthetic** — deep void backgrounds, additive-blended particles, teal/violet glow accents, and sharp clip-path geometry on interactive elements.

**Live:** [lymakara-dev.pages.dev](https://lymakara-dev.pages.dev)

---

## Features

| Feature | Detail |
|---|---|
| **3D Particle Background** | 3 000-point sphere with 4 glow colors, additive blending, mouse parallax |
| **Wireframe TorusKnot** | Faint background mesh that slowly rotates |
| **Grid Floor** | Perspective grid at y = −20 for depth |
| **R3F Avatar Scene** | React Three Fiber canvas with orbit controls and a GLTF avatar |
| **Camera Rig** | Smooth mouse parallax + scroll-driven Z/Y tracking |
| **Scroll Reveal** | IntersectionObserver fades every section heading and card in |
| **Side Map** | Fixed right-edge dot navigation — highlights active section |
| **Custom Cursor** | 12 px teal dot (snaps) + 40 px ring (lerp, mix-blend-mode: screen) |
| **NOVA Design System** | CSS custom properties, clip-path buttons, card hover glows |
| **SEO** | Full meta tags, Open Graph, Twitter Card, JSON-LD Person schema |

---

## Tech Stack

### Core
- **React 19** + **TypeScript 5.9**
- **Vite** (via rolldown-vite) for fast dev/build
- **Tailwind CSS v4**

### 3D / Graphics
- **Three.js r182** — vanilla WebGL canvas for the particle background
- **@react-three/fiber** — declarative 3D scene (avatar, lighting, orbit controls)
- **@react-three/drei** — `OrbitControls`, `Html`, `useGLTF` helpers
- **@react-spring/three** — spring-physics mesh animations

### Deployment
- **Cloudflare Pages** via Wrangler — static asset hosting, global CDN

---

## Project Structure

```
makara-3d-website/
├── public/
│   ├── favicon.svg
│   └── models/
│       └── avatar.glb          # GLTF avatar model
├── src/
│   ├── components/
│   │   ├── Contact.tsx         # Contact cards (email, phone, GitHub, Telegram…)
│   │   ├── ExperienceList.tsx  # Work history cards
│   │   ├── Hero.tsx            # Full-viewport hero section
│   │   ├── Projects.tsx        # Pinned GitHub project grid
│   │   ├── ResumeButton.tsx    # Primary CTA button
│   │   ├── SideMap.tsx         # Fixed dot-nav for page sections
│   │   ├── Skills.tsx          # Skill tag grid
│   │   └── particles/          # Particle systems (Starfield, Snow, Fireflies)
│   ├── data/
│   │   └── cv.ts               # Single source of truth for all content
│   ├── App.tsx                 # Layout, cursor, scroll reveal
│   ├── ThreeBackground.tsx     # Vanilla Three.js particle canvas (fixed, z-index 0)
│   ├── ThreeScene.tsx          # R3F canvas — avatar + orbit controls
│   └── index.css               # NOVA design system (CSS vars, utility classes)
├── index.html                  # SEO meta, JSON-LD, Google Fonts
└── wrangler.toml               # Cloudflare Pages config
```

---

## Getting Started

### Prerequisites
- Node.js ≥ 18
- npm ≥ 9

### Install

```bash
git clone https://github.com/lymakara-dev/makara-3d-website.git
cd makara-3d-website
npm install
```

### Development

```bash
npm run dev
```

Opens at `http://localhost:5173` (or the next available port).

### Production Build

```bash
npm run build
```

Output goes to `dist/`. Preview the production build locally:

```bash
npm run preview
```

### Deploy

```bash
npm run deploy
```

Deploys `dist/` to Cloudflare Pages using Wrangler. Make sure you are authenticated (`wrangler login`) before running.

---

## Design System

All design tokens live in `src/index.css` as CSS custom properties.

```css
--void:        #03020a   /* page background      */
--deep:        #07051a
--surface:     #0d0b26   /* card background      */
--glow-blue:   #4d9fff
--glow-violet: #a259ff
--glow-teal:   #00ffe0   /* primary accent       */
--glow-pink:   #ff4d9f
--text-bright: #f0eeff
--text-mid:    #8c85b8
--text-dim:    #3d3866
```

**Fonts**

| Role | Family |
|---|---|
| Headings | Bebas Neue |
| Labels / mono | Space Mono |
| Body | DM Sans |

**Key utility classes**

| Class | Purpose |
|---|---|
| `.btn-nova-primary` | Clip-path parallelogram, teal → blue gradient |
| `.btn-nova-ghost` | Same shape, transparent with dim border |
| `.nova-card` | Surface bg, top-edge glow on hover |
| `.nova-label` | `// SECTION` prefix, violet, Space Mono |
| `.reveal` + `.visible` | Scroll-driven opacity / translateY animation |

---

## Content

All page content — bio, skills, experience, projects, and contact details — is centralised in **`src/data/cv.ts`**. Edit that single file to update anything on the site.

---

## License

MIT — free to fork and adapt for your own portfolio.

---

<p align="center">
  Built by <a href="https://github.com/lymakara-dev">Ly Makara</a> &nbsp;·&nbsp; Phnom Penh, Cambodia
</p>
