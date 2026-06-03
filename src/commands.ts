import { readFile, writeFile } from "node:fs/promises";
import { ZodError } from "zod";
import { generateSecurityMarkdown } from "./openai.js";
import { buildPrompt } from "./prompts.js";
import {
  type CommandInputMap,
  type CommandName,
  disclosureDraftInputSchema,
  prRiskReviewInputSchema,
  securityTriageInputSchema
} from "./types.js";

export type ExecuteCommandOptions = {
  command: CommandName;
  inputPath: string;
  outputPath?: string;
  dryRun?: boolean;
  apiKey?: string;
  model?: string;
};

export type ExecuteCommandResult = {
  markdown: string;
  wroteFile: boolean;
};

export async function executeCommand(options: ExecuteCommandOptions): Promise<ExecuteCommandResult> {
  const rawInput = await readJson(options.inputPath);
  const input = parseCommandInput(options.command, rawInput);
  const prompt = buildPrompt(options.command, input);
  const apiKey = options.apiKey ?? process.env.OPENAI_API_KEY;
  const markdown = await generateSecurityMarkdown({
    command: options.command,
    prompt,
    apiKey,
    dryRun: options.dryRun ?? !apiKey,
    model: options.model ?? process.env.OPENAI_MODEL
  });

  if (options.outputPath) {
    await writeFile(options.outputPath, markdown, "utf8");
    return { markdown, wroteFile: true };
  }

  return { markdown, wroteFile: false };
}

async function readJson(path: string): Promise<unknown> {
  try {
    return JSON.parse(await readFile(path, "utf8")) as unknown;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`Could not read JSON input at ${path}: ${message}`);
  }
}

function parseCommandInput<TCommand extends CommandName>(
  command: TCommand,
  input: unknown
): CommandInputMap[TCommand] {
  try {
    switch (command) {
      case "security-triage":
        return securityTriageInputSchema.parse(input) as CommandInputMap[TCommand];
      case "pr-risk-review":
        return prRiskReviewInputSchema.parse(input) as CommandInputMap[TCommand];
      case "disclosure-draft":
        return disclosureDraftInputSchema.parse(input) as CommandInputMap[TCommand];
    }
  } catch (error) {
    if (error instanceof ZodError) {
      throw new Error(`Invalid ${command} input: ${error.issues.map((issue) => issue.message).join("; ")}`);
    }
    throw error;
  }
}
