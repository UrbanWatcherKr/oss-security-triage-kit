# OSS Security Triage Kit Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Convert the repository into a Codex Security-aligned white-hat OSS security triage project.

**Architecture:** The CLI routes three defensive security workflows to schema validation, prompt building, and OpenAI or dry-run Markdown generation. GitHub Actions read PR metadata and produce safe PR risk-review artifacts without mutating repository state.

**Tech Stack:** Node.js, TypeScript, Vitest, Commander, Zod, OpenAI SDK, GitHub Actions.

---

### Task 1: Replace Workflow Contracts

- [x] Replace generic maintainer commands with `security-triage`, `pr-risk-review`, and `disclosure-draft`.
- [x] Add schemas for vulnerability reports, PR risk reviews, and responsible disclosure drafts.
- [x] Update prompt builders with defensive white-hat safety boundaries.

### Task 2: Replace CLI Surface

- [x] Rename the package to `oss-security-triage-kit`.
- [x] Rename the CLI binary to `ostk`.
- [x] Update command routing and tests for all new commands.

### Task 3: Replace Public Materials

- [x] Rewrite README around defensive security, Codex Security fit, and safety boundaries.
- [x] Replace examples with security report, PR risk, and disclosure examples.
- [x] Update GitHub Actions to generate PR risk-review artifacts.

### Task 4: Verify and Publish

- [ ] Run tests, typecheck, build, audit, and dry-run CLI smoke commands.
- [ ] Run pre-push secret scan.
- [ ] Commit changes and push to GitHub.
- [ ] Rename the GitHub repository to `oss-security-triage-kit` if available.
