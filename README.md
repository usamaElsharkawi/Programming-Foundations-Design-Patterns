# Design Patterns — TypeScript Edition

A hands-on companion to the **Programming Foundations: Design Patterns** course
(originally taught in Java), re-implemented in modern, strict **TypeScript**.

## How we work (our workflow)

1. **You watch** the course lecture and understand it.
2. **We discuss** the concept together — deeply and language-agnostically first.
3. **I demo** how to apply it in TypeScript, right in our chat.
4. **You implement** it yourself in the `sandbox/` folder.
5. **I review** your code and give feedback.
6. When you say “document it”, **I write up** what we learned into that section's `README.md`.
7. We **commit & push** after each session.

## Folder structure

```
.
├── 01-design-patterns/   ← Section folders (documentation ONLY, README per section)
├── 02-strategy/
├── 03-adapter/
├── 04-observer/
├── 05-decorator/
├── 06-iterator/
├── 07-factory/
├── 08-glossaries/
├── 09-conclusion/
├── sandbox/              ← ALL TypeScript code & tooling lives here
│   ├── 01-design-patterns/   ← your practice files, per section
│   ├── 02-strategy/
│   ├── …
│   ├── package.json
│   ├── tsconfig.json
│   └── node_modules/         ← (not committed)
├── design_patterns_course_content.md
└── README.md
```

> The section folders (01–09) hold **only documentation**. Every piece of code,
> plus all Node.js tooling, is isolated inside `sandbox/` so concepts and code
> never mix.

## Setup

```bash
cd sandbox
npm install
```

## Run a sandbox file

```bash
cd sandbox
npm run start -- 02-strategy/duck.ts
```

> Note: the repo folder name contains a colon, which breaks `npx`. Use the
> `cd sandbox && npm run start -- <file>` form above instead.

## Type-check

```bash
cd sandbox && npm run typecheck
```
