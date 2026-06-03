# OSS Security Triage Kit Design

## Goal

Reposition the repository as a defensive open-source security workflow kit that fits Codex Security: vulnerability report triage, pull request risk review, and responsible disclosure drafting.

## Audience

The primary users are open-source maintainers and independent white-hat researchers. The tool should help them communicate risk, request safe verification, plan remediation, and prepare disclosures without enabling exploit development or unauthorized activity.

## Product Shape

The CLI is named `ostk` and supports three commands:

- `ostk security-triage --input examples/security-report.json`
- `ostk pr-risk-review --input examples/pr-risk.json`
- `ostk disclosure-draft --input examples/disclosure.json`

Each command reads structured JSON, builds a defensive prompt, and writes Markdown to stdout or a file. If `OPENAI_API_KEY` is absent or `--dry-run` is set, the CLI produces deterministic prompt-preview Markdown.

## Safety Boundary

The project supports defensive triage, risk summaries, safe reproduction checklists, remediation questions, regression test suggestions, and responsible disclosure drafts. It does not provide exploit code, weaponized payloads, bypass guidance, persistence, evasion, or unauthorized access steps.

## Codex Security Fit

Codex Security is relevant because the core workflows involve reviewing risky code changes, vulnerability reports, and remediation plans. The project creates a concrete place to apply Codex Security to OSS maintenance and white-hat research workflows.
