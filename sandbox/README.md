# Sandbox

This is YOUR practice area — and the home of **all** TypeScript tooling for the
course. After we discuss a pattern together, implement it yourself in the
matching subfolder (e.g. `02-strategy/`). I will review what you write here.

All Node.js tooling (`package.json`, `tsconfig.json`, `node_modules`) lives inside
this folder, keeping the course's concept/documentation folders completely free
of code.

## Setup (run once)

```bash
cd sandbox
npm install
```

## Run a file

```bash
npm run start -- 02-strategy/idiomatic/simulator.ts
```

## Strategy Pattern (02-strategy)

Two implementations for the same pattern:

- **faithful/** (in `02-strategy/`, root) — class-based, direct line-by-line
  Java translation. `interface` contracts, classes for behaviors, `new`
  everywhere.

- **idiomatic/** — function-type refactor. Single-method strategies become
  `type` aliases + arrow functions. No `new` on behaviors, inlined function
  injection works naturally.

Both produce identical output. Run either simulator to see:

```bash
npm run start -- 02-strategy/simulator.ts           # faithful
npm run start -- 02-strategy/idiomatic/simulator.ts # idiomatic
```

## Type-check

```bash
npm run typecheck
```
