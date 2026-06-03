# Maintainer Copilot Kit

OpenAI-powered CLI and GitHub Action starter kit for open-source maintainer automation.

Maintainer Copilot Kit helps maintainers turn noisy repository activity into practical Markdown:

- Pull request summaries with review focus and risk notes
- Issue triage notes with label recommendations
- Release note drafts from merged changes

The CLI is safe to evaluate without an API key. By default, it falls back to a deterministic dry-run artifact that shows the prompt shape instead of calling OpenAI.

## Why This Exists

Open-source maintainers spend real time on pull request review, issue triage, release notes, and contributor replies. This project packages those workflows into a small CLI that can be run locally or inside GitHub Actions.

It is designed to fit maintainer automation and release workflow use cases, including the kind of work described by OpenAI's Codex for Open Source program. It does not guarantee credits or program acceptance; it gives a project a clear, useful OSS maintenance automation story.

## Install

```bash
npm install
npm run build
```

For local development:

```bash
npm run dev -- pr-summary --input examples/pr.json --dry-run
```

After building:

```bash
node dist/cli.js pr-summary --input examples/pr.json --dry-run
```

## Commands

### PR Summary

```bash
mck pr-summary --input examples/pr.json --dry-run
```

### Issue Triage

```bash
mck issue-triage --input examples/issue.json --dry-run
```

### Release Notes

```bash
mck release-notes --input examples/release.json --dry-run
```

Write output to a file:

```bash
mck release-notes --input examples/release.json --output release-notes.md --dry-run
```

## Live OpenAI Generation

Set an API key and omit `--dry-run`.

Set `OPENAI_API_KEY` in your shell or CI secret store, then run:

```bash
mck issue-triage --input examples/issue.json --output issue-triage.md
```

The default model is `gpt-4.1-mini`. Override it with:

```bash
export OPENAI_MODEL="gpt-4.1-mini"
mck pr-summary --input examples/pr.json
```

or:

```bash
mck pr-summary --input examples/pr.json --model gpt-4.1-mini
```

## Input Shapes

### Pull Request

```json
{
  "repository": "owner/project",
  "number": 42,
  "title": "Add cache warming",
  "author": "contributor",
  "body": "Adds a cache warmer for release pages.",
  "files": [{ "path": "src/cache.ts", "additions": 24, "deletions": 3 }],
  "commits": ["feat: add cache warmer"],
  "labels": ["performance"]
}
```

### Issue

```json
{
  "repository": "owner/project",
  "number": 7,
  "title": "CLI crashes on empty input",
  "author": "reporter",
  "body": "Running the CLI with an empty file crashes.",
  "comments": ["I can reproduce this on Node 22."],
  "existingLabels": ["bug", "needs-repro", "docs"]
}
```

### Release

```json
{
  "repository": "owner/project",
  "version": "1.2.0",
  "previousVersion": "1.1.0",
  "changes": [
    { "title": "Add cache warming", "number": 42, "author": "contributor", "labels": ["performance"] }
  ]
}
```

## GitHub Actions

Copy `.github/workflows/maintainer-copilot.yml` into a repository that has this package installed or checked out. On pull requests, the example workflow reads PR metadata, generates a PR summary artifact, and uses `OPENAI_API_KEY` from repository secrets when available. On manual runs, it creates dry-run sample artifacts.

It intentionally avoids posting comments or mutating labels in the first version.

## Development

```bash
npm test
npm run typecheck
npm run build
```

## License

MIT
