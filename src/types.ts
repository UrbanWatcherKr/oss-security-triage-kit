import { z } from "zod";

export const commandNames = ["pr-summary", "issue-triage", "release-notes"] as const;

export type CommandName = (typeof commandNames)[number];

export type PromptMessages = {
  system: string;
  user: string;
};

const fileChangeSchema = z.object({
  path: z.string().min(1),
  additions: z.number().int().nonnegative(),
  deletions: z.number().int().nonnegative()
});

export const prSummaryInputSchema = z.object({
  repository: z.string().min(1),
  number: z.number().int().positive(),
  title: z.string().min(1),
  author: z.string().min(1),
  body: z.string().default(""),
  files: z.array(fileChangeSchema).default([]),
  commits: z.array(z.string()).default([]),
  labels: z.array(z.string()).default([])
});

export const issueTriageInputSchema = z.object({
  repository: z.string().min(1),
  number: z.number().int().positive(),
  title: z.string().min(1),
  author: z.string().min(1),
  body: z.string().default(""),
  comments: z.array(z.string()).default([]),
  existingLabels: z.array(z.string()).default([])
});

const releaseChangeSchema = z.object({
  title: z.string().min(1),
  number: z.number().int().positive(),
  author: z.string().min(1),
  labels: z.array(z.string()).default([])
});

export const releaseNotesInputSchema = z.object({
  repository: z.string().min(1),
  version: z.string().min(1),
  previousVersion: z.string().min(1),
  changes: z.array(releaseChangeSchema).default([])
});

export type PrSummaryInput = z.infer<typeof prSummaryInputSchema>;
export type IssueTriageInput = z.infer<typeof issueTriageInputSchema>;
export type ReleaseNotesInput = z.infer<typeof releaseNotesInputSchema>;

export type CommandInputMap = {
  "pr-summary": PrSummaryInput;
  "issue-triage": IssueTriageInput;
  "release-notes": ReleaseNotesInput;
};
