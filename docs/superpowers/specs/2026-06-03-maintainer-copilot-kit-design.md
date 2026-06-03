# Maintainer Copilot Kit Design

## Goal

Build an open-source CLI and GitHub Action starter kit that helps open-source maintainers generate PR summaries, issue triage notes, and release note drafts with OpenAI.

## Audience

The primary users are primary and core maintainers of active open-source projects. The project should be useful even before it has adoption signals: it must be easy to run locally, safe to evaluate without an API key, and clear about how API credits would support maintainer automation and release workflows.

## Product Shape

The first release ships a Node.js CLI named `mck`.

The CLI supports three commands:

- `mck pr-summary --input fixture.json`
- `mck issue-triage --input fixture.json`
- `mck release-notes --input fixture.json`

Each command reads JSON input, builds a maintainer-focused prompt, and writes Markdown output to stdout or a file. If `OPENAI_API_KEY` is present and the run is not `--dry-run`, the CLI calls the OpenAI API. Otherwise it produces a deterministic dry-run artifact that shows the prompt and expected output shape.

## Architecture

The project keeps behavior in small modules:

- `src/cli.ts` parses arguments and routes commands.
- `src/commands.ts` validates input, chooses the workflow, and formats output.
- `src/prompts.ts` builds prompts for each maintainer task.
- `src/openai.ts` wraps the OpenAI SDK and dry-run behavior.
- `src/types.ts` defines input and output contracts.

Tests cover prompt generation, command execution, dry-run behavior, and invalid input. The CLI avoids posting comments or mutating GitHub state in the first version. Example GitHub Action workflows show maintainers how to wire the CLI into their own repositories.

## Public Project Materials

The repository includes:

- `README.md` with install, usage, dry-run examples, and OpenAI OSS application positioning.
- `LICENSE` using MIT.
- `.github/workflows/maintainer-copilot.yml` as a copyable example workflow.
- `examples/` JSON inputs and expected Markdown outputs.

## Non-Goals

The first release does not create GitHub comments, labels, or releases automatically. It does not store repository data or require a backend service.
