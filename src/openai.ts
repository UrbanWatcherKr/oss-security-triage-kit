import OpenAI from "openai";
import type { CommandName, PromptMessages } from "./types.js";

export const DEFAULT_MODEL = "gpt-4.1-mini";

export type GenerateMarkdownOptions = {
  command: CommandName;
  prompt: PromptMessages;
  apiKey?: string;
  dryRun?: boolean;
  model?: string;
};

export async function generateMaintainerMarkdown(options: GenerateMarkdownOptions): Promise<string> {
  if (options.dryRun || !options.apiKey) {
    return buildDryRunMarkdown(options.command, options.prompt);
  }

  const client = new OpenAI({ apiKey: options.apiKey });
  const completion = await client.chat.completions.create({
    model: options.model ?? DEFAULT_MODEL,
    temperature: 0.2,
    messages: [
      { role: "system", content: options.prompt.system },
      { role: "user", content: options.prompt.user }
    ]
  });

  const markdown = completion.choices[0]?.message?.content;
  if (!markdown) {
    throw new Error("OpenAI returned an empty response.");
  }

  return markdown;
}

function buildDryRunMarkdown(command: CommandName, prompt: PromptMessages): string {
  return [
    `# Dry Run: ${toDisplayName(command)}`,
    "",
    "No OpenAI request was made. Set `OPENAI_API_KEY` and omit `--dry-run` to generate live maintainer output.",
    "",
    "## Prompt Preview",
    "",
    "### System",
    "",
    prompt.system,
    "",
    "### User",
    "",
    prompt.user,
    ""
  ].join("\n");
}

function toDisplayName(command: CommandName): string {
  switch (command) {
    case "pr-summary":
      return "PR Summary";
    case "issue-triage":
      return "Issue Triage";
    case "release-notes":
      return "Release Notes";
  }
}
