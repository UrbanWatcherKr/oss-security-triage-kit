import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, beforeEach, describe, expect, test } from "vitest";
import { executeCommand } from "../src/commands.js";

let tempDir: string;

beforeEach(async () => {
  tempDir = await mkdtemp(join(tmpdir(), "ostk-"));
});

afterEach(async () => {
  await rm(tempDir, { force: true, recursive: true });
});

describe("executeCommand", () => {
  test("returns deterministic dry-run Markdown for security triage", async () => {
    const inputPath = join(tempDir, "security-report.json");
    await writeFile(
      inputPath,
      JSON.stringify({
        repository: "owner/project",
        reportId: "SEC-2026-001",
        title: "Stored XSS in project dashboard",
        reporter: "whitehat-researcher",
        summary: "Project names may render without escaping.",
        affectedComponents: ["dashboard"],
        severityClaim: "high",
        evidence: ["No production user data was accessed."],
        impact: "A project editor may execute JavaScript in a maintainer session.",
        requestedOutcome: "Confirm impact and prepare fix plan."
      }),
      "utf8"
    );

    const result = await executeCommand({
      command: "security-triage",
      inputPath,
      dryRun: true
    });

    expect(result.markdown).toContain("# Dry Run: Security Triage");
    expect(result.markdown).toContain("SEC-2026-001");
    expect(result.markdown).toContain("Stored XSS in project dashboard");
    expect(result.wroteFile).toBe(false);
  });

  test("writes Markdown output for PR risk reviews", async () => {
    const inputPath = join(tempDir, "risk.json");
    const outputPath = join(tempDir, "risk.md");
    await writeFile(
      inputPath,
      JSON.stringify({
        repository: "owner/project",
        number: 42,
        title: "Refactor session middleware",
        author: "contributor",
        body: "Changes how session cookies are parsed and refreshed.",
        files: [{ path: "src/auth/session.ts", additions: 80, deletions: 30 }],
        dependencyChanges: ["cookie-parser 1.4.6 -> 1.4.7"],
        securitySensitivePaths: ["src/auth/session.ts"],
        labels: ["auth"]
      }),
      "utf8"
    );

    const result = await executeCommand({
      command: "pr-risk-review",
      inputPath,
      outputPath,
      dryRun: true
    });

    const output = await readFile(outputPath, "utf8");
    expect(result.wroteFile).toBe(true);
    expect(output).toBe(result.markdown);
    expect(output).toContain("# Dry Run: PR Risk Review");
  });

  test("throws a helpful error for invalid disclosure input", async () => {
    const inputPath = join(tempDir, "disclosure.json");
    await writeFile(
      inputPath,
      JSON.stringify({
        repository: "owner/project",
        vulnerabilityTitle: "Improper authorization on project export"
      }),
      "utf8"
    );

    await expect(
      executeCommand({
        command: "disclosure-draft",
        inputPath,
        dryRun: true
      })
    ).rejects.toThrow("Invalid disclosure-draft input");
  });
});
