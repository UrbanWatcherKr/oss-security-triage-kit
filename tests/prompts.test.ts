import { describe, expect, test } from "vitest";
import { buildPrompt } from "../src/prompts.js";

describe("buildPrompt", () => {
  test("builds a maintainer-focused PR summary prompt", () => {
    const prompt = buildPrompt("pr-summary", {
      repository: "owner/project",
      number: 42,
      title: "Add cache warming",
      author: "contributor",
      body: "Adds a cache warmer for release pages.",
      files: [
        { path: "src/cache.ts", additions: 24, deletions: 3 },
        { path: "tests/cache.test.ts", additions: 18, deletions: 0 }
      ],
      commits: ["feat: add cache warmer"],
      labels: ["performance"]
    });

    expect(prompt.system).toContain("open-source maintainer");
    expect(prompt.user).toContain("owner/project#42");
    expect(prompt.user).toContain("Add cache warming");
    expect(prompt.user).toContain("src/cache.ts (+24/-3)");
    expect(prompt.user).toContain("Return Markdown");
  });

  test("builds an issue triage prompt with label guidance", () => {
    const prompt = buildPrompt("issue-triage", {
      repository: "owner/project",
      number: 7,
      title: "CLI crashes on empty input",
      author: "reporter",
      body: "Running the CLI with an empty file crashes.",
      comments: ["I can reproduce this on Node 22."],
      existingLabels: ["bug", "needs-repro", "docs", "enhancement"]
    });

    expect(prompt.system).toContain("triage");
    expect(prompt.user).toContain("owner/project#7");
    expect(prompt.user).toContain("CLI crashes on empty input");
    expect(prompt.user).toContain("bug, needs-repro, docs, enhancement");
    expect(prompt.user).toContain("Recommended labels");
  });

  test("builds a release notes prompt from merged changes", () => {
    const prompt = buildPrompt("release-notes", {
      repository: "owner/project",
      version: "1.2.0",
      previousVersion: "1.1.0",
      changes: [
        { title: "Add cache warming", number: 42, author: "contributor", labels: ["performance"] },
        { title: "Fix empty input crash", number: 43, author: "maintainer", labels: ["bug"] }
      ]
    });

    expect(prompt.system).toContain("release notes");
    expect(prompt.user).toContain("owner/project");
    expect(prompt.user).toContain("1.1.0 to 1.2.0");
    expect(prompt.user).toContain("#42 Add cache warming");
    expect(prompt.user).toContain("Group changes");
  });
});
