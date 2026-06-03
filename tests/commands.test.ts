import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, beforeEach, describe, expect, test } from "vitest";
import { executeCommand } from "../src/commands.js";

let tempDir: string;

beforeEach(async () => {
  tempDir = await mkdtemp(join(tmpdir(), "mck-"));
});

afterEach(async () => {
  await rm(tempDir, { force: true, recursive: true });
});

describe("executeCommand", () => {
  test("returns deterministic dry-run Markdown for PR summaries", async () => {
    const inputPath = join(tempDir, "pr.json");
    await writeFile(
      inputPath,
      JSON.stringify({
        repository: "owner/project",
        number: 42,
        title: "Add cache warming",
        author: "contributor",
        body: "Adds a cache warmer for release pages.",
        files: [{ path: "src/cache.ts", additions: 24, deletions: 3 }],
        commits: ["feat: add cache warmer"],
        labels: ["performance"]
      }),
      "utf8"
    );

    const result = await executeCommand({
      command: "pr-summary",
      inputPath,
      dryRun: true
    });

    expect(result.markdown).toContain("# Dry Run: PR Summary");
    expect(result.markdown).toContain("owner/project#42");
    expect(result.markdown).toContain("Add cache warming");
    expect(result.wroteFile).toBe(false);
  });

  test("writes Markdown output when outputPath is provided", async () => {
    const inputPath = join(tempDir, "issue.json");
    const outputPath = join(tempDir, "issue.md");
    await writeFile(
      inputPath,
      JSON.stringify({
        repository: "owner/project",
        number: 7,
        title: "CLI crashes on empty input",
        author: "reporter",
        body: "Running the CLI with an empty file crashes.",
        comments: ["I can reproduce this on Node 22."],
        existingLabels: ["bug", "needs-repro", "docs"]
      }),
      "utf8"
    );

    const result = await executeCommand({
      command: "issue-triage",
      inputPath,
      outputPath,
      dryRun: true
    });

    const output = await readFile(outputPath, "utf8");
    expect(result.wroteFile).toBe(true);
    expect(output).toBe(result.markdown);
    expect(output).toContain("# Dry Run: Issue Triage");
  });

  test("throws a helpful error for invalid command input", async () => {
    const inputPath = join(tempDir, "release.json");
    await writeFile(
      inputPath,
      JSON.stringify({
        repository: "owner/project",
        version: "1.2.0"
      }),
      "utf8"
    );

    await expect(
      executeCommand({
        command: "release-notes",
        inputPath,
        dryRun: true
      })
    ).rejects.toThrow("Invalid release-notes input");
  });
});
