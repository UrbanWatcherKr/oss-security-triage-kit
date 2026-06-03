# OSS Security Triage Kit

OpenAI-powered white-hat security triage CLI and GitHub Action starter kit for open-source maintainers.

OSS Security Triage Kit helps maintainers and independent security researchers turn sensitive security work into safe, useful Markdown:

- Vulnerability report triage with severity rationale and safe verification checklists
- Pull request risk review for auth, dependency, middleware, and other security-sensitive changes
- Responsible disclosure drafts that avoid operational exploit detail

The project is intentionally defensive. It does not generate exploit code, payloads, bypass instructions, persistence guidance, evasion advice, or steps for unauthorized access.

## Why This Exists

Open-source maintainers often receive incomplete vulnerability reports, risky pull requests, and time-sensitive disclosure questions. Independent white-hat researchers also need a structured way to report findings without drifting into unsafe detail.

This kit is designed around responsible security workflows:

- Help maintainers understand credible risk quickly
- Help white-hat researchers communicate impact safely
- Help projects prepare fixes, regression tests, and advisories
- Make ethical bug bounty and AI red-team work easier to do within clear boundaries

It is a better fit for Codex Security than a generic maintainer assistant because its core workflows are security triage, PR risk review, and responsible disclosure.

## Install

```bash
npm install
npm run build
```

For local development:

```bash
npm run dev -- security-triage --input examples/security-report.json --dry-run
```

After building:

```bash
node dist/cli.js security-triage --input examples/security-report.json --dry-run
```

## Commands

### Security Triage

```bash
ostk security-triage --input examples/security-report.json --dry-run
```

Produces a defensive triage artifact with:

- Triage Decision
- Severity Rationale
- Safe Reproduction Checklist
- Remediation Questions
- Responsible Maintainer Reply

### PR Risk Review

```bash
ostk pr-risk-review --input examples/pr-risk.json --dry-run
```

Produces a security review artifact with:

- Risk Overview
- Security Review Focus
- Potential Vulnerability Classes
- Tests To Request
- Safe Maintainer Reply

### Disclosure Draft

```bash
ostk disclosure-draft --input examples/disclosure.json --dry-run
```

Produces responsible disclosure material with:

- Responsible Disclosure Draft
- Advisory Summary
- User Impact
- Mitigations
- Timeline
- Coordinated Disclosure Notes

Write output to a file:

```bash
ostk disclosure-draft --input examples/disclosure.json --output disclosure.md --dry-run
```

## Live OpenAI Generation

Set `OPENAI_API_KEY` in your shell or CI secret store, then omit `--dry-run`.

```bash
ostk security-triage --input examples/security-report.json --output triage.md
```

The default model is `gpt-4.1-mini`. Override it with:

```bash
export OPENAI_MODEL="gpt-4.1-mini"
ostk pr-risk-review --input examples/pr-risk.json
```

or:

```bash
ostk pr-risk-review --input examples/pr-risk.json --model gpt-4.1-mini
```

## GitHub Actions

The included workflow reads pull request metadata, builds a PR risk-review input, and generates a Markdown artifact. If `OPENAI_API_KEY` is configured as a repository secret, it produces a live AI review artifact. Without a key, it safely creates a dry-run prompt preview.

The workflow uses read-only repository permissions and intentionally avoids posting comments, changing labels, or mutating repository state.

## Safety Boundary

Allowed:

- Defensive triage
- Risk summaries
- Safe reproduction checklists
- Remediation questions
- Regression test suggestions
- Responsible disclosure drafts

Not allowed by project design:

- Exploit construction
- Weaponized payloads
- Bypass or evasion steps
- Persistence or privilege abuse guidance
- Instructions for unauthorized access

See [SECURITY.md](SECURITY.md) for responsible disclosure guidance and [CONTRIBUTING.md](CONTRIBUTING.md) for contribution safety rules.

## Development

```bash
npm test
npm run typecheck
npm run build
```

## OpenAI OSS Program Positioning

This repository is meant to support responsible open-source security work. Codex Security would help review risky pull requests, vulnerability reports, and remediation plans. API credits would support safe triage artifacts, disclosure drafts, and maintainer-facing security summaries.

## License

MIT
