# AGENTS.md — trac-dia-thien-phu-ui

Vite 8 + React 19 + TypeScript template (still stock template: `App.tsx` is demo content, `src/components/` is empty). No test runner, no CI.

## Commands (verified)

- `npm run dev` — Vite dev server with HMR
- `npm run build` — `tsc -b && vite build`; this IS the typecheck, there is no separate typecheck script
- `npm run lint` — `eslint .` (exit 0 on clean tree)
- `npm run preview` — serve `dist/` after build

No tests configured — do not invent a test command. No formatter script.

## Entrypoints

`index.html` → `src/main.tsx` → `src/App.tsx`. Put new components in `src/components/`, static imports in `src/assets/`, unprocessed static files in `public/`.

## TypeScript gotchas (enforced, will fail build)

- Project references: root `tsconfig.json` has `files: []` and references `tsconfig.app.json` (`src/`) + `tsconfig.node.json` (`vite.config.ts`). Edit the right file for the right scope.
- `verbatimModuleSyntax: true` — type imports must use `import type`.
- `erasableSyntaxOnly: true` — no enums, namespaces, or parameter properties.
- `noUnusedLocals` + `noUnusedParameters: true` — build fails on unused vars.
- `jsx: react-jsx`, `moduleDetection: force`, `moduleResolution: bundler`.

## ESLint

Flat config in `eslint.config.js`: `dist` ignored, only `**/*.{ts,tsx}` linted (recommended + `react-hooks` + `react-refresh` + `typescript-eslint`). No type-aware rules enabled.

## Shell

PowerShell 5.1: chain with `; if ($?) { ... }`, not `&&`.

## Important rules
- Always check docs folder first:
    + If the feature existed, update the md file in plans/specs folder
    + If the feature doesn't exist, create a new file in plans/specs folder with page_name.md and use english. Like example: warehouse.md
- Before implementing a task, make sure it follow by these steps: create/update spec file in specs folder => user reviewed and approved => create/update plan file in plans folder => user reviewed and approved => implementation