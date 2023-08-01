# Contributing

## Table of Contents

- [Introduction](#introduction)
- [Requirements](#requirements)
- [Setting up your local repo](#setting-up-your-local-repo)
- [Using Codespaces](#using-codespaces)
- [Making Changes](#making-changes)
- [Opening a Pull Request](#opening-a-pull-request)

## Introduction

We gladly accept contributions from individuals of all skill levels and any scale. As an open-source initiative, we value reciprocating to our contributors and are delighted to offer assistance in areas such as PRs, technical writing, and transforming envisioned features into tangible realities. We appreciate code contributions, documentation improvements, bug reports, feature requests, and more.

> **Useful advice for newcomers:**
> Check out [https://github.com/firstcontributions/first-contributions](https://github.com/firstcontributions/first-contributions) for valuable guidance on how to make contributions effectively.

## Requirements

- Node.js version 16.x or later
- pnpm version 8.6.6 or later

To develop a package locally, follow the steps below:

## Setting up your local repo

This repository uses Turborepo, which means you must execute `pnpm install` from the main project directory. By running `pnpm install` in the root of the main project, you will install dependencies for all packages within the repository.

Clone the repo:

```
git clone https://github.com/modular-rocks/slimfast-turbo.git
```

Install dependencies:

```
pnpm install

```

Build the packages:

```
pnpm build
```

Test the packages:

```
pnpm test
```

## Using Codespaces

To get started, create a codespace for this repository by clicking this:

[![Open in GitHub Codespaces](https://github.com/codespaces/badge.svg)](https://codespaces.new/modular-rocks/slimfast-turbo)

Your new codespace will open in a web-based version of Visual Studio Code. All development dependencies will be preinstalled.

**Note**: You can also run it with [vscode devcontainers](https://code.visualstudio.com/docs/devcontainers/containers) and [other supporting tools](https://containers.dev/supporting).

## Making changes

To make changes to a package, navigate to the package directory and make your changes.

### Testing only one package

Sometimes it's useful to test only the package you are working on before running tests for all package.To test one package run the following command from the root of the project:

```
pnpm test --filter <package-name> <optional-file-name>
```

> **Note:** You can use other commands like `build` in the combination with `--filter` flag.

## Opening a pull request

We use [changesets](https://github.com/changesets/changesets) to manage our releases. A changeset is a file that describes the user-facing changes of a package. You need to add a changeset whenever you make a change to a package. It can be an empty changeset if you don't think the change is user-facing.

### Creating a changeset

To add a changeset, run:

```
pnpm changeset
```

When you run `pnpm changeset`, it will prompt you for the changes you made to each package, and then it will create a changeset file in the `.changeset` directory. You can edit the changeset file to add more information about the changes.

### Versioning

This projects uses [semantic versioning](https://semver.org/). When you add a changeset, you will be asked to choose a release type. The release type determines the version bump of the package when it is released.
