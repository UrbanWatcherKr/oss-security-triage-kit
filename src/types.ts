import { z } from "zod";

export const commandNames = ["security-triage", "pr-risk-review", "disclosure-draft"] as const;

export type CommandName = (typeof commandNames)[number];

export type PromptMessages = {
  system: string;
  user: string;
};

const severitySchema = z.enum(["informational", "low", "medium", "high", "critical"]);

export const securityTriageInputSchema = z.object({
  repository: z.string().min(1),
  reportId: z.string().min(1),
  title: z.string().min(1),
  reporter: z.string().min(1),
  summary: z.string().min(1),
  affectedComponents: z.array(z.string().min(1)).default([]),
  severityClaim: severitySchema.optional(),
  evidence: z.array(z.string().min(1)).default([]),
  impact: z.string().min(1),
  reproductionNotes: z.string().optional(),
  requestedOutcome: z.string().default("Help the maintainer assess impact and plan a responsible fix.")
});

const changedFileSchema = z.object({
  path: z.string().min(1),
  additions: z.number().int().nonnegative(),
  deletions: z.number().int().nonnegative(),
  riskNotes: z.string().optional()
});

export const prRiskReviewInputSchema = z.object({
  repository: z.string().min(1),
  number: z.number().int().positive(),
  title: z.string().min(1),
  author: z.string().min(1),
  body: z.string().default(""),
  files: z.array(changedFileSchema).default([]),
  dependencyChanges: z.array(z.string().min(1)).default([]),
  securitySensitivePaths: z.array(z.string().min(1)).default([]),
  labels: z.array(z.string().min(1)).default([])
});

const timelineEventSchema = z.object({
  date: z.string().min(1),
  event: z.string().min(1)
});

export const disclosureDraftInputSchema = z.object({
  repository: z.string().min(1),
  vulnerabilityTitle: z.string().min(1),
  reporter: z.string().min(1),
  affectedVersions: z.array(z.string().min(1)).default([]),
  status: z.enum(["new", "triaged", "reproduced", "fixed", "published"]),
  impact: z.string().min(1),
  mitigation: z.string().min(1),
  fixedVersion: z.string().optional(),
  timeline: z.array(timelineEventSchema).default([]),
  creditPreference: z.string().optional()
});

export type SecurityTriageInput = z.infer<typeof securityTriageInputSchema>;
export type PrRiskReviewInput = z.infer<typeof prRiskReviewInputSchema>;
export type DisclosureDraftInput = z.infer<typeof disclosureDraftInputSchema>;

export type CommandInputMap = {
  "security-triage": SecurityTriageInput;
  "pr-risk-review": PrRiskReviewInput;
  "disclosure-draft": DisclosureDraftInput;
};
