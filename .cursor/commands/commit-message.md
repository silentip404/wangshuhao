# Git Commit Message Generation Guide

This document defines the rules for generating Git commit messages in this project. Generated messages **MUST** follow the Conventional Commits specification with the project-specific requirements below.

---

## Project-Specific Guidelines

### Language

The generated commit message **MUST** be written in the user's target language.

### Staged Changes Analysis

- **MUST** only analyze staged (not unstaged) file changes as the basis for generating commit messages
- **MUST** distinguish between primary changes and secondary changes caused by them (e.g., import path updates due to file renaming)
- **MUST** ask the user for clarification if the intent of the changes cannot be accurately determined, rather than guessing

### Commit Atomicity

- Each commit **SHOULD** focus on a single purpose or logical change
- **SHOULD** recommend the user to split staged changes into separate commits if they contain multiple unrelated modifications

### Scope Selection

- The scope **SHOULD** reflect the actual module or component being modified
- Multiple scopes **MAY** be separated by commas if changes span multiple modules (e.g., `feat(auth,api): ...`)
- The scope **MAY** be omitted if changes are too scattered to identify a clear subject, but you **MUST** explain to the user why the scope was omitted

### Interaction Protocol

- **MUST NOT** execute the commit directly
- **MUST** only provide the generated commit message and ask the user for confirmation before committing
- **MUST** provide a concise response with only essential content; avoid excessive explanations

---

## Conventional Commits 1.0.0

### Format

The commit message **MUST** be structured as follows:

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

### Structural Elements

| Element             | Description                                                                |
| ------------------- | -------------------------------------------------------------------------- |
| **fix**             | Patches a bug in the codebase                                              |
| **feat**            | Introduces a new feature to the codebase                                   |
| **BREAKING CHANGE** | A footer or `!` after the type/scope that introduces a breaking API change |
| **Other types**     | `build`, `chore`, `ci`, `docs`, `style`, `refactor`, `perf`, `test`, etc.  |

### Examples

Commit message with description and breaking change footer:

```
feat: allow provided config object to extend other configs

BREAKING CHANGE: `extends` key in config file is now used for extending other config files
```

Commit message with `!` to draw attention to breaking change:

```
feat!: send an email to the customer when a product is shipped
```

Commit message with scope and `!` to draw attention to breaking change:

```
feat(api)!: send an email to the customer when a product is shipped
```

Commit message with both `!` and BREAKING CHANGE footer:

```
chore!: drop support for Node 6

BREAKING CHANGE: use JavaScript features not available in Node 6.
```

Commit message with no body:

```
docs: correct spelling of CHANGELOG
```

Commit message with scope:

```
feat(lang): add Polish language
```

Commit message with multi-paragraph body and multiple footers:

```
fix: prevent racing of requests

Introduce a request id and a reference to latest request. Dismiss
incoming responses other than from latest request.

Remove timeouts which were used to mitigate the racing issue but are
obsolete now.

Reviewed-by: Z
Refs: #123
```

### Specification

The key words **MUST**, **MUST NOT**, **REQUIRED**, **SHALL**, **SHALL NOT**, **SHOULD**, **SHOULD NOT**, **RECOMMENDED**, **MAY**, and **OPTIONAL** in this section are to be interpreted as described in RFC 2119.

- Commits **MUST** be prefixed with a type, which consists of a noun (`feat`, `fix`, etc.), followed by the **OPTIONAL** scope, **OPTIONAL** `!`, and **REQUIRED** terminal colon and space
- The type `feat` **MUST** be used when a commit adds a new feature to your application or library
- The type `fix` **MUST** be used when a commit represents a bug fix for your application
- A scope **MAY** be provided after a type; a scope **MUST** consist of a noun describing a section of the codebase surrounded by parenthesis, e.g., `fix(parser):`
- A description **MUST** immediately follow the colon and space after the type/scope prefix; the description is a short summary of the code changes
- A longer commit body **MAY** be provided after the short description, providing additional contextual information about the code changes; the body **MUST** begin one blank line after the description
- A commit body is free-form and **MAY** consist of any number of newline separated paragraphs
- One or more footers **MAY** be provided one blank line after the body; each footer **MUST** consist of a word token, followed by either a `:<space>` or `<space>#` separator, followed by a string value
- A footer's token **MUST** use `-` in place of whitespace characters, e.g., `Acked-by`; an exception is made for `BREAKING CHANGE`, which **MAY** also be used as a token
- A footer's value **MAY** contain spaces and newlines, and parsing **MUST** terminate when the next valid footer token/separator pair is observed
- Breaking changes **MUST** be indicated in the type/scope prefix of a commit, or as an entry in the footer
- If included as a footer, a breaking change **MUST** consist of the uppercase text `BREAKING CHANGE`, followed by a colon, space, and description
- If included in the type/scope prefix, breaking changes **MUST** be indicated by a `!` immediately before the `:`; if `!` is used, `BREAKING CHANGE:` **MAY** be omitted from the footer section
- Types other than `feat` and `fix` **MAY** be used in your commit messages
- The units of information that make up Conventional Commits **MUST NOT** be treated as case sensitive by implementors, with the exception of `BREAKING CHANGE` which **MUST** be uppercase
- `BREAKING-CHANGE` **MUST** be synonymous with `BREAKING CHANGE`, when used as a token in a footer
