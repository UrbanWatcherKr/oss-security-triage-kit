#!/usr/bin/env node
import { pathToFileURL } from "node:url";
import { Command } from "commander";
import { type ExecuteCommandOptions, executeCommand } from "./commands.js";
import type { CommandName } from "./types.js";

export type CliDependencies = {
  execute?: (options: ExecuteCommandOptions) => Promise<{ markdown: string; wroteFile: boolean }>;
  stdout?: { write: (chunk: string) => unknown };
};

export async function runCli(argv: string[] = process.argv.slice(2), dependencies: CliDependencies = {}): Promise<void> {
  const execute = dependencies.execute ?? executeCommand;
  const stdout = dependencies.stdout ?? process.stdout;
  const program = createProgram(execute, stdout);

  await program.parseAsync(argv, { from: "user" });
}

function createProgram(
  execute: (options: ExecuteCommandOptions) => Promise<{ markdown: string; wroteFile: boolean }>,
  stdout: { write: (chunk: string) => unknown }
): Command {
  const program = new Command()
    .name("mck")
    .description("OpenAI-powered maintainer automation for pull requests, issues, and releases.")
    .showHelpAfterError()
    .version("0.1.0");

  addMaintainerCommand(program, "pr-summary", "Generate a maintainer-focused pull request summary.", execute, stdout);
  addMaintainerCommand(program, "issue-triage", "Generate issue triage notes and label recommendations.", execute, stdout);
  addMaintainerCommand(program, "release-notes", "Generate release notes from merged changes.", execute, stdout);

  return program;
}

function addMaintainerCommand(
  program: Command,
  command: CommandName,
  description: string,
  execute: (options: ExecuteCommandOptions) => Promise<{ markdown: string; wroteFile: boolean }>,
  stdout: { write: (chunk: string) => unknown }
): void {
  program
    .command(command)
    .description(description)
    .requiredOption("-i, --input <path>", "Path to the JSON input file.")
    .option("-o, --output <path>", "Write Markdown output to a file instead of stdout.")
    .option("--model <model>", "OpenAI model to use. Defaults to OPENAI_MODEL or gpt-4.1-mini.")
    .option("--dry-run", "Print deterministic prompt-preview Markdown without calling OpenAI.")
    .action(async (options: { input: string; output?: string; model?: string; dryRun?: boolean }) => {
      const result = await execute({
        command,
        inputPath: options.input,
        outputPath: options.output,
        dryRun: options.dryRun,
        model: options.model
      });

      if (!result.wroteFile) {
        stdout.write(`${result.markdown}\n`);
      }
    });
}

if (isDirectRun()) {
  runCli().catch((error: unknown) => {
    const message = error instanceof Error ? error.message : String(error);
    console.error(message);
    process.exitCode = 1;
  });
}

function isDirectRun(): boolean {
  return process.argv[1] ? import.meta.url === pathToFileURL(process.argv[1]).href : false;
}
