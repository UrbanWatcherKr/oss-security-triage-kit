import { describe, expect, test } from "vitest";
import { buildPrompt } from "../src/prompts.js";

describe("buildPrompt", () => {
  test("builds a defensive vulnerability report triage prompt", () => {
    const prompt = buildPrompt("security-triage", {
      repository: "owner/project",
      reportId: "SEC-2026-001",
      title: "Stored XSS in project dashboard",
      reporter: "whitehat-researcher",
      summary: "User-supplied project names may render without escaping.",
      affectedComponents: ["dashboard", "project settings"],
      severityClaim: "high",
      evidence: [
        "Screenshot shows script execution in a maintainer-owned test instance.",
        "No production user data was accessed."
      ],
      impact: "An attacker with project edit access may execute JavaScript in another maintainer session.",
      reproductionNotes: "Use a local test instance and a benign marker string only.",
      requestedOutcome: "Confirm impact and prepare a responsible fix plan."
    });

    expect(prompt.system).toContain("white-hat");
    expect(prompt.system).toContain("Do not provide exploit code");
    expect(prompt.user).toContain("owner/project");
    expect(prompt.user).toContain("SEC-2026-001");
    expect(prompt.user).toContain("Stored XSS in project dashboard");
    expect(prompt.user).toContain("Safe Reproduction Checklist");
  });

  test("builds a pull request risk review prompt for security-sensitive changes", () => {
    const prompt = buildPrompt("pr-risk-review", {
      repository: "owner/project",
      number: 42,
      title: "Refactor session middleware",
      author: "contributor",
      body: "Changes how session cookies are parsed and refreshed.",
      files: [
        { path: "src/auth/session.ts", additions: 80, deletions: 30, riskNotes: "touches cookie parsing" },
        { path: "src/middleware.ts", additions: 25, deletions: 11 }
      ],
      dependencyChanges: ["cookie-parser 1.4.6 -> 1.4.7"],
      securitySensitivePaths: ["src/auth/session.ts", "src/middleware.ts"],
      labels: ["auth", "security-review"]
    });

    expect(prompt.system).toContain("security reviewer");
    expect(prompt.system).toContain("defensive review");
    expect(prompt.user).toContain("owner/project#42");
    expect(prompt.user).toContain("src/auth/session.ts (+80/-30): touches cookie parsing");
    expect(prompt.user).toContain("Potential Vulnerability Classes");
    expect(prompt.user).toContain("Tests To Request");
  });

  test("builds a responsible disclosure draft prompt", () => {
    const prompt = buildPrompt("disclosure-draft", {
      repository: "owner/project",
      vulnerabilityTitle: "Improper authorization on project export",
      reporter: "whitehat-researcher",
      affectedVersions: ["1.4.0", "1.4.1"],
      status: "reproduced",
      impact: "A member with read access may export metadata intended for project admins.",
      mitigation: "Restrict export endpoint to project admins and add an authorization regression test.",
      fixedVersion: "1.4.2",
      timeline: [
        { date: "2026-06-01", event: "Report received" },
        { date: "2026-06-03", event: "Maintainer reproduced and prepared fix" }
      ],
      creditPreference: "Credit reporter by GitHub username."
    });

    expect(prompt.system).toContain("responsible disclosure");
    expect(prompt.system).toContain("avoid operational exploit detail");
    expect(prompt.user).toContain("Improper authorization on project export");
    expect(prompt.user).toContain("1.4.0, 1.4.1");
    expect(prompt.user).toContain("Coordinated Disclosure Notes");
  });
});
