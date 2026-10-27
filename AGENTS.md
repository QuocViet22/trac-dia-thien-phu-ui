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

## Workflow rules (Superpowers)

Skills are loaded with the `skill` tool, not slash commands. If a named skill
isn't found, use the `skill` tool to list available skills and pick the closest
match. Do not skip a step because the skill is missing; tell the user instead.

Always check `docs/` first. Existing feature → update its file. New feature →
create `docs/specs/<page_name>.md` (English, e.g. warehouse.md).

For any non-trivial task, follow these steps in order and stop at each gate:

1. Spec: load the `brainstorming` skill. Write or update
   `docs/specs/<page_name>.md`. STOP and wait for user approval.
2. Plan: load the `writing-plans` skill. Write or update
   `docs/plans/<page_name>.md` with checkbox steps. The final step must be
   "update the spec if behavior changed." STOP and wait for user approval.
3. Implement: load the `executing-plans` skill. Work test-first, tick plan
   checkboxes as you go, and run the test/lint commands after each batch.
4. Before finishing: load the code-review skill
   (`requesting-code-review`) and the `verification-before-completion` skill,
   then confirm all checkboxes are ticked.

Save all outputs to the paths above, not to any default location.
Skip this workflow only for trivial fixes (typos, one-line changes).

## Code minimalism (Ponytail)

- Before step 3, load the `ponytail` skill and keep it active at `full` level
  for the whole implementation. Before writing new code, check for existing
  code, the stdlib, native platform features, or already-installed dependencies.
- In plans, prefer reusing existing modules over creating new ones, and
  list what existing code each step reuses.
- Never trade away validation, security, or accessibility to write less code.
- Before finishing, load the `ponytail-review` skill to check for
  over-engineering, in addition to the normal code-review skill.
- If Ponytail and the approved spec/plan conflict, the spec and plan win.
  Ask the user instead of silently dropping requirements.
- Required tests are never "dead code." Do not delete them for minimalism.