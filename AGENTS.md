# Amoorion website — shared agent guide

Welcome, Joker, Cleo, Merlin, and whoever joins us next. Sett Sarverott is
the author and project lead. This is our common guide; keep project facts
here so the next colleague can continue without guessing.

## Read first

1. [README.md](README.md), including its dedication and links for agents.
2. The active workshop's `AGENTS.md`: here, `/home/sarverott/__WORKSHOP/AGENTS.md`.
3. [Sett's introduction](https://sett.sarverott.com/llms.txt), particularly
   [who Sett is](https://github.com/Sarverott/Sarverott/blob/master/docs/agents/who-is-sett.md),
   [working rhythm](https://github.com/Sarverott/Sarverott/blob/master/docs/agents/working-rhythm.md),
   and [Cleo's reflections](https://github.com/Sarverott/Sarverott/blob/master/docs/agents/reflections-of-cleo.md).
   These give context; repository-specific procedures from another project
   do not automatically become this project's procedures.
4. For product claims, consult [the neighboring project's guide](../amoorion/AGENTS.md),
   [vision](../amoorion/docs/devlog/VISION.md), current devlog, and
   [documentation](https://amoorion.readthedocs.io/).

Follow Sett's current instructions and the applicable workshop rules.
Preserve unresolved questions as TODOs rather than inventing policy.

## What we are building

A presentation website for **Amoorion**, an early-stage tool for publishing,
reading, replying, and connecting communication platforms. The product has
a Python core, platform plugins, CLI, HTTP API, MCP server, and daemon.
Its implementation and status belong to `../amoorion/`; this repository
owns the website source and its content studio.

Public entry points:

- Website: <https://sarverott.github.io/amoorion/>
- Product: <https://github.com/Sarverott/amoorion>
- Docs: <https://amoorion.readthedocs.io/>
- Package: <https://pypi.org/project/amoorion/>

## Source, build checkout, and published output

- **This repository** (`amoorion-website/`): edit website source here.
- **`../amoorion/website/`**: an ignored clone used by the product's website
  build. `scripts/build-website.sh` in that repository deletes and recreates
  it from the repository/ref in `.github/flow.toml`. Do not put durable work
  there; coordinate changes with Cleo through the source repository.
- **`../amoorion/site/`**: assembled static output, combining `website/dist/`
  with project, releases, examples, and machine-readable pages. Edit the
  owning source or generator rather than this output.
- The neighboring `gh-pages.yml` builds and publishes that output. Its
  settings observed on 2026-10-31 select `Sarverott/amoorion-website` at
  `main`, with output on `github-pages`. Re-read these settings before
  changing anything that affects deployment.

GitHub Pages serves static files. This repository's Express `/api/*` routes
need a separately running server; a frontend build alone does not supply
them. Preserve the `/amoorion/` deployment base and check asset paths when
changing the frontend or its build.

## Current code map

| Path | Responsibility |
| --- | --- |
| `src/main.tsx`, `src/App.tsx` | React entry, page composition, language/content state, local storage, repository statistics |
| `src/components/` | Header, hero, features, introduction, ecosystem, footer, content studio |
| `src/components/HeadlessCmsModal.tsx` | Content studio and GitHub configuration/actions |
| `src/data/default-content.ts`, `src/types/content.ts` | Default content and its schema/types |
| `src/locales/translations.ts` | Translation dictionaries currently imported by the app |
| `src/locales/langpack-*.yaml` | Additional language material; verify integration before claiming support |
| `src/utils/content-parser.ts`, adjacent test | Content validation, merging, and commit-payload helpers |
| `src/index.css`, `public/` | Styling and static assets |
| `server.ts` | Express server, GitHub API proxy/content writes, Vite development middleware, production static serving |
| `vite.config.ts` | React/Tailwind build and development settings |

The frontend uses React 19, TypeScript, Vite, and Tailwind CSS 4. Keep the
existing visual direction and Sett's authored graphics unless the task
calls for a change.

## Working together

- Begin with `git status --short`, the current branch, and the relevant diff.
  Existing changes belong to Sett or another colleague; do not discard,
  stage, overwrite, or reformat them as part of unrelated work.
- Re-read a file immediately before editing it. Keep changes focused and
  prefer small modules with clear responsibilities. Coordinate overlapping
  work through an explicit handoff; a colleague's name is not evidence
  that they are currently available or have approved a change.
- Read Sett's notes and TODOs for intent. Be candid about disagreement and
  uncertainty. Distinguish observed behavior, assumptions, and future ideas.
- Record a handoff with the changed files, decisions, checks and their
  results, and remaining questions. Do not write in another agent's voice
  or rewrite their reflections.
- Leave commits and pushes to Sett unless the current task authorizes them.
  The neighboring product has its own automatic release-on-push workflow;
  do not import its commit/push procedure into this repository.
- BOS's workshop flow is `master → development → revision → testing →
  releasing → master` through a PR. This checkout currently uses `main`,
  which the neighboring publisher consumes. TODO: reconcile this project's
  branch/release setup with BOS before implementation that changes that
  setup. Do not rename branches or change the publisher's ref incidentally.
- Keep secrets out of source, logs, documentation, and commits. Do not read
  or overwrite private `.env` files during orientation. Consult the owning
  project's vault rules before touching product credentials.
- Keep real account posts, remote content writes, publishing, and release
  actions within Sett's explicitly authorized task scope.

## Local commands and verification

Use the installed project tools; read `package.json` again before relying
on this list.

```sh
npm run dev       # Express + Vite development server, port 3000
npm run build     # frontend build into dist/
npm run lint      # TypeScript check (tsc --noEmit)
npm run preview   # static frontend preview; no Express API
node --import tsx --test src/utils/content-parser.test.ts
```

As observed on 2026-10-31, `Taskfile.yml` only prints a greeting. There is
no `npm test` script, although `.husky/pre-commit` calls `npm test`. These
are unfinished tooling, not passing checks. Do not bypass hooks to hide
the mismatch; resolve it when working on tooling or preparing a commit.

For code changes, run the relevant checks and report their actual results.
For browser behavior, inspect the affected flow in a browser when possible.
For documentation-only changes, check paths and accuracy; do not claim the
application was tested. Avoid whole-repository formatting over shared drafts.

## Content honesty

Website copy is not proof of product support. Check the product's current
code and documentation before promising integrations or capabilities.
The current defaults include aspirational claims, and `server.ts` returns
illustrative statistics and commit history on GitHub failures. Do not cite
those fallback values as real activity. Preserve the distinction between
tests against fake APIs and verified behavior on real platforms.

