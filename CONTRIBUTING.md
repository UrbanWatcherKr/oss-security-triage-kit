# Contributing

Thanks for helping improve OSS Security Triage Kit.

## Good Contributions

- Improve defensive prompt quality
- Add safer schema validation
- Add tests for security triage, PR risk review, and disclosure drafting
- Improve GitHub Actions examples
- Improve documentation for maintainers and white-hat researchers

## Safety Rules

Keep contributions defensive. Do not add features that generate exploit code, weaponized payloads, bypass steps, persistence, evasion, or unauthorized access instructions.

When adding examples, use synthetic repositories, harmless marker strings, and local test scenarios. Avoid real targets, real secrets, or sensitive vulnerability details from active reports.

## Development

```bash
npm install
npm test
npm run typecheck
npm run build
```

## Pull Request Checklist

- Tests cover the behavior change
- Dry-run output stays safe and deterministic
- README or examples are updated when the CLI surface changes
- The change stays inside the project safety boundary
