import {
  type CommandInputMap,
  type CommandName,
  type IssueTriageInput,
  type PrSummaryInput,
  type PromptMessages,
  type ReleaseNotesInput,
  issueTriageInputSchema,
  prSummaryInputSchema,
  releaseNotesInputSchema
} from "./types.js";

export function buildPrompt<TCommand extends CommandName>(
  command: TCommand,
  input: CommandInputMap[TCommand]
): PromptMessages {
  switch (command) {
    case "pr-summary":
      return buildPrSummaryPrompt(prSummaryInputSchema.parse(input));
    case "issue-triage":
      return buildIssueTriagePrompt(issueTriageInputSchema.parse(input));
    case "release-notes":
      return buildReleaseNotesPrompt(releaseNotesInputSchema.parse(input));
  }
}

function buildPrSummaryPrompt(input: PrSummaryInput): PromptMessages {
  const files = input.files
    .map((file) => `- ${file.path} (+${file.additions}/-${file.deletions})`)
    .join("\n") || "- No file list provided";
  const commits = input.commits.map((commit) => `- ${commit}`).join("\n") || "- No commits provided";
  const labels = input.labels.join(", ") || "none";

  return {
    system:
      "You are an open-source maintainer assistant. Summarize pull requests with practical review context, risks, and next actions.",
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
      "Commits:",
      commits,
      "",
      "Return Markdown with sections: Summary, Review Focus, Risk Notes, Suggested Maintainer Reply."
    ].join("\n")
  };
}

function buildIssueTriagePrompt(input: IssueTriageInput): PromptMessages {
  const comments = input.comments.map((comment) => `- ${comment}`).join("\n") || "- No comments provided";
  const labels = input.existingLabels.join(", ") || "none";

  return {
    system:
      "You are an open-source maintainer assistant focused on issue triage. Be concise, evidence-based, and helpful.",
    user: [
      `Issue: ${input.repository}#${input.number}`,
      `Title: ${input.title}`,
      `Author: ${input.author}`,
      `Available labels: ${labels}`,
      "",
      "Body:",
      input.body || "(empty)",
      "",
      "Comments:",
      comments,
      "",
      "Return Markdown with sections: Triage Summary, Recommended labels, Missing Information, Suggested Maintainer Reply."
    ].join("\n")
  };
}

function buildReleaseNotesPrompt(input: ReleaseNotesInput): PromptMessages {
  const changes = input.changes
    .map((change) => {
      const labels = change.labels.length > 0 ? ` [${change.labels.join(", ")}]` : "";
      return `- #${change.number} ${change.title} by ${change.author}${labels}`;
    })
    .join("\n") || "- No changes provided";

  return {
    system:
      "You are an open-source maintainer assistant that writes release notes for developers and contributors.",
    user: [
      `Repository: ${input.repository}`,
      `Release range: ${input.previousVersion} to ${input.version}`,
      "",
      "Merged changes:",
      changes,
      "",
      "Group changes into Markdown sections: Highlights, Fixes, Maintenance, Contributors. Keep the tone factual."
    ].join("\n")
  };
}
