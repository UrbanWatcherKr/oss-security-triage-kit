# Maintainer Copilot Kit Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a public-ready TypeScript CLI and GitHub Action starter kit for OpenAI-powered OSS maintainer automation.

**Architecture:** A small Node.js package exposes the `mck` CLI. Command modules validate JSON input, prompt modules build task-specific prompts, and an OpenAI wrapper either calls the API or returns deterministic dry-run Markdown.

**Tech Stack:** Node.js, TypeScript, Vitest, Commander, Zod, OpenAI SDK, GitHub Actions.

---

### File Structure

- `package.json`: scripts, dependencies, binary registration.
- `tsconfig.json`: TypeScript compiler settings.
- `vitest.config.ts`: test runner settings.
- `src/types.ts`: command names, schemas, and shared output types.
- `src/prompts.ts`: prompt builders for PR summary, issue triage, and release notes.
- `src/openai.ts`: OpenAI client and dry-run generation.
- `src/commands.ts`: workflow execution and output formatting.
- `src/cli.ts`: command-line argument parsing.
- `src/index.ts`: public exports.
- `tests/*.test.ts`: behavior tests written before implementation.
- `examples/*.json` and `examples/*.md`: sample inputs and outputs.
- `.github/workflows/maintainer-copilot.yml`: reusable workflow example.
- `README.md`, `LICENSE`, `.gitignore`: public project material.

### Task 1: Project Skeleton

**Files:**
- Create: `package.json`
- Create: `tsconfig.json`
- Create: `vitest.config.ts`
- Create: `.gitignore`
- Create: `src/index.ts`

- [ ] Create minimal package and TypeScript configuration.
- [ ] Install dependencies with `npm install`.
- [ ] Run `npm test` and confirm the runner is available.

### Task 2: Prompt Builders

**Files:**
- Create: `tests/prompts.test.ts`
- Create: `src/types.ts`
- Create: `src/prompts.ts`

- [ ] Write failing tests for all three prompt builders.
- [ ] Run `npm test -- tests/prompts.test.ts` and confirm failure from missing modules.
- [ ] Implement schemas and prompt builders.
- [ ] Run `npm test -- tests/prompts.test.ts` and confirm pass.

### Task 3: Command Execution

**Files:**
- Create: `tests/commands.test.ts`
- Create: `src/openai.ts`
- Create: `src/commands.ts`

- [ ] Write failing tests for dry-run output, output-file writing, and invalid input.
- [ ] Run `npm test -- tests/commands.test.ts` and confirm failure from missing modules.
- [ ] Implement command execution and dry-run OpenAI wrapper.
- [ ] Run `npm test -- tests/commands.test.ts` and confirm pass.

### Task 4: CLI Interface

**Files:**
- Create: `tests/cli.test.ts`
- Create: `src/cli.ts`
- Modify: `package.json`

- [ ] Write failing tests for `pr-summary`, `issue-triage`, and `release-notes` argument parsing.
- [ ] Run `npm test -- tests/cli.test.ts` and confirm failure from missing CLI module.
- [ ] Implement Commander CLI and package binary entry.
- [ ] Run `npm test -- tests/cli.test.ts` and confirm pass.

### Task 5: OSS Readiness

**Files:**
- Create: `README.md`
- Create: `LICENSE`
- Create: `examples/pr.json`
- Create: `examples/issue.json`
- Create: `examples/release.json`
- Create: `examples/pr-summary.md`
- Create: `examples/issue-triage.md`
- Create: `examples/release-notes.md`
- Create: `.github/workflows/maintainer-copilot.yml`

- [ ] Add README with use cases, commands, dry-run behavior, and OpenAI OSS program positioning.
- [ ] Add examples and workflow file.
- [ ] Run `npm run build`, `npm test`, and local CLI smoke commands.
- [ ] Initialize git, commit, and attempt GitHub publication with `gh repo create maintainer-copilot-kit --public --source=. --push` if authentication is available.

### Self-Review

- Spec coverage: CLI, GitHub Action, dry-run safety, OpenAI API usage, docs, and examples are mapped to tasks.
- Placeholder scan: no task depends on undefined future work.
- Scope check: no backend, mutation workflow, or GitHub write automation is included in v1.
