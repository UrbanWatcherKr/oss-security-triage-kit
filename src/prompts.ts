import {
  type CommandInputMap,
  type CommandName,
  type DisclosureDraftInput,
  type PrRiskReviewInput,
  type PromptMessages,
  type SecurityTriageInput,
  disclosureDraftInputSchema,
  prRiskReviewInputSchema,
  securityTriageInputSchema
} from "./types.js";

const defensiveSystemBoundary = [
  "You support white-hat, defensive security work for open-source maintainers.",
  "Do not provide exploit code, weaponized payloads, bypass steps, persistence, evasion, or instructions for unauthorized access.",
  "Focus on safe triage, risk assessment, remediation planning, regression tests, and responsible disclosure."
].join(" ");

export function buildPrompt<TCommand extends CommandName>(
  command: TCommand,
  input: CommandInputMap[TCommand]
): PromptMessages {
  switch (command) {
    case "security-triage":
      return buildSecurityTriagePrompt(securityTriageInputSchema.parse(input));
    case "pr-risk-review":
      return buildPrRiskReviewPrompt(prRiskReviewInputSchema.parse(input));
    case "disclosure-draft":
      return buildDisclosureDraftPrompt(disclosureDraftInputSchema.parse(input));
  }
}

function buildSecurityTriagePrompt(input: SecurityTriageInput): PromptMessages {
  const components = formatList(input.affectedComponents, "No affected components provided");
  const evidence = formatList(input.evidence, "No evidence provided");

  return {
    system: `${defensiveSystemBoundary} Act as a careful security triage partner for maintainers.`,
    user: [
      `Repository: ${input.repository}`,
      `Report ID: ${input.reportId}`,
      `Title: ${input.title}`,
      `Reporter: ${input.reporter}`,
      `Claimed severity: ${input.severityClaim ?? "not specified"}`,
      "",
      "Summary:",
      input.summary,
      "",
      "Affected components:",
      components,
      "",
      "Evidence:",
      evidence,
      "",
      "Impact:",
      input.impact,
      "",
      "Safe reproduction notes:",
      input.reproductionNotes ?? "Only propose benign, local, permissioned verification steps.",
      "",
      "Requested outcome:",
      input.requestedOutcome,
      "",
      "Return Markdown with sections: Triage Decision, Severity Rationale, Safe Reproduction Checklist, Remediation Questions, Responsible Maintainer Reply."
    ].join("\n")
  };
}

function buildPrRiskReviewPrompt(input: PrRiskReviewInput): PromptMessages {
  const files = input.files
    .map((file) => {
      const riskNotes = file.riskNotes ? `: ${file.riskNotes}` : "";
      return `- ${file.path} (+${file.additions}/-${file.deletions})${riskNotes}`;
    })
    .join("\n") || "- No file list provided";
  const dependencyChanges = formatList(input.dependencyChanges, "No dependency changes provided");
  const sensitivePaths = formatList(input.securitySensitivePaths, "No security-sensitive paths identified");
  const labels = input.labels.join(", ") || "none";

  return {
    system:
      `${defensiveSystemBoundary} Act as a security reviewer performing defensive review of a pull request before maintainers merge it.`,
    user: [
      `Pull request: ${input.repository}#${input.number}`,
      `Title: ${input.title}`,
      `Author: ${input.author}`,
      `Labels: ${labels}`,
      "",
      "Body:",
      input.body || "(empty)",
      "",
      "Changed files:",
      files,
      "",
      "Dependency changes:",
      dependencyChanges,
      "",
      "Security-sensitive paths:",
      sensitivePaths,
      "",
      "Return Markdown with sections: Risk Overview, Security Review Focus, Potential Vulnerability Classes, Tests To Request, Safe Maintainer Reply."
    ].join("\n")
  };
}

function buildDisclosureDraftPrompt(input: DisclosureDraftInput): PromptMessages {
  const versions = input.affectedVersions.join(", ") || "not specified";
  const timeline = input.timeline.map((entry) => `- ${entry.date}: ${entry.event}`).join("\n") || "- No timeline provided";

  return {
    system:
      `${defensiveSystemBoundary} Draft responsible disclosure material that must avoid operational exploit detail and helps users patch safely.`,
    user: [
      `Repository: ${input.repository}`,
      `Vulnerability: ${input.vulnerabilityTitle}`,
      `Reporter: ${input.reporter}`,
      `Affected versions: ${versions}`,
      `Status: ${input.status}`,
      `Fixed version: ${input.fixedVersion ?? "not available yet"}`,
      "",
      "Impact:",
      input.impact,
      "",
      "Mitigation:",
      input.mitigation,
      "",
      "Timeline:",
      timeline,
      "",
      "Credit preference:",
      input.creditPreference ?? "Ask the reporter before publishing credit.",
      "",
      "Return Markdown with sections: Responsible Disclosure Draft, Advisory Summary, User Impact, Mitigations, Timeline, Coordinated Disclosure Notes."
    ].join("\n")
  };
}

function formatList(items: string[], empty: string): string {
  return items.length > 0 ? items.map((item) => `- ${item}`).join("\n") : `- ${empty}`;
}
