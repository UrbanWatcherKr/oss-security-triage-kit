import { describe, expect, test } from "vitest";
import { runCli } from "../src/cli.js";
import type { ExecuteCommandOptions, ExecuteCommandResult } from "../src/commands.js";

describe("runCli", () => {
  test("routes pr-summary arguments to executeCommand and writes stdout", async () => {
    let capturedOptions: ExecuteCommandOptions | undefined;
    let stdout = "";

    await runCli(["pr-summary", "--input", "pr.json", "--dry-run"], {
      execute: async (options) => {
        capturedOptions = options;
        return { markdown: "PR output", wroteFile: false };
      },
      stdout: { write: (chunk) => { stdout += chunk; } }
    });

    expect(capturedOptions).toEqual({
      command: "pr-summary",
      inputPath: "pr.json",
      outputPath: undefined,
      dryRun: true,
      model: undefined
    });
    expect(stdout).toBe("PR output\n");
  });

  test("routes issue-triage output paths without duplicating stdout", async () => {
    let capturedOptions: ExecuteCommandOptions | undefined;
    let stdout = "";

    await runCli(["issue-triage", "--input", "issue.json", "--output", "issue.md"], {
      execute: async (options) => {
        capturedOptions = options;
        return { markdown: "Issue output", wroteFile: true };
      },
      stdout: { write: (chunk) => { stdout += chunk; } }
    });

    expect(capturedOptions?.command).toBe("issue-triage");
    expect(capturedOptions?.inputPath).toBe("issue.json");
    expect(capturedOptions?.outputPath).toBe("issue.md");
    expect(stdout).toBe("");
  });

  test("routes release-notes model options", async () => {
    let capturedResult: ExecuteCommandResult | undefined;
    let capturedOptions: ExecuteCommandOptions | undefined;

    await runCli(["release-notes", "--input", "release.json", "--model", "gpt-4.1-mini"], {
      execute: async (options) => {
        capturedOptions = options;
        capturedResult = { markdown: "Release output", wroteFile: false };
        return capturedResult;
      },
      stdout: { write: () => {} }
    });

    expect(capturedOptions?.command).toBe("release-notes");
    expect(capturedOptions?.model).toBe("gpt-4.1-mini");
    expect(capturedResult?.markdown).toBe("Release output");
  });
});
