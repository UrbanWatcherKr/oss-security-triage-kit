import { describe, expect, test } from "vitest";
import { runCli } from "../src/cli.js";
import type { ExecuteCommandOptions, ExecuteCommandResult } from "../src/commands.js";

describe("runCli", () => {
  test("routes security-triage arguments to executeCommand and writes stdout", async () => {
    let capturedOptions: ExecuteCommandOptions | undefined;
    let stdout = "";

    await runCli(["security-triage", "--input", "security-report.json", "--dry-run"], {
      execute: async (options) => {
        capturedOptions = options;
        return { markdown: "Security triage output", wroteFile: false };
      },
      stdout: { write: (chunk) => { stdout += chunk; } }
    });

    expect(capturedOptions).toEqual({
      command: "security-triage",
      inputPath: "security-report.json",
      outputPath: undefined,
      dryRun: true,
      model: undefined
    });
    expect(stdout).toBe("Security triage output\n");
  });

  test("routes pr-risk-review output paths without duplicating stdout", async () => {
    let capturedOptions: ExecuteCommandOptions | undefined;
    let stdout = "";

    await runCli(["pr-risk-review", "--input", "risk.json", "--output", "risk.md"], {
      execute: async (options) => {
        capturedOptions = options;
        return { markdown: "Risk output", wroteFile: true };
      },
      stdout: { write: (chunk) => { stdout += chunk; } }
    });

    expect(capturedOptions?.command).toBe("pr-risk-review");
    expect(capturedOptions?.inputPath).toBe("risk.json");
    expect(capturedOptions?.outputPath).toBe("risk.md");
    expect(stdout).toBe("");
  });

  test("routes disclosure-draft model options", async () => {
    let capturedResult: ExecuteCommandResult | undefined;
    let capturedOptions: ExecuteCommandOptions | undefined;

    await runCli(["disclosure-draft", "--input", "disclosure.json", "--model", "gpt-4.1-mini"], {
      execute: async (options) => {
        capturedOptions = options;
        capturedResult = { markdown: "Disclosure output", wroteFile: false };
        return capturedResult;
      },
      stdout: { write: () => {} }
    });

    expect(capturedOptions?.command).toBe("disclosure-draft");
    expect(capturedOptions?.model).toBe("gpt-4.1-mini");
    expect(capturedResult?.markdown).toBe("Disclosure output");
  });
});
