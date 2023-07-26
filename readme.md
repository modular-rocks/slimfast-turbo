# Slimfast Turbo

This is a monorepo containing the Slimfast modularization tool and related packages.

## Development

To develop locally:

1. Clone the repo
2. Run `npm install -g pnpm` to install pnpm globally
3. Run `pnpm install` to install dependencies
4. Run `pnpm run dev` to start development mode
5. Make code changes
6. Run `pnpm run build` to build
7. Run `pnpm test` to run tests
8. Commit changes and submit PR

## Packages

- `@modular-rocks/slimfast` - Base Slimfast package
- `@modular-rocks/slimfast-node` - Slimfast for Node.js
- `@modular-rocks/workspace` - Virtual codebase abstraction
- `@modular-rocks/workspace-node` - Workspace for Node.js
- `@modular-rocks/traverse-files` - File/directory utilities

## License

Apache 2.0
