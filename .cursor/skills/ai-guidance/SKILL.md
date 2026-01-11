---
name: ai-guidance
description: Apply when creating or editing AI guidance documents ('**/AGENTS.md', '.cursor/**/*.md')
---

# AI Prompt Engineering Guide

Before creating or modifying any AI guidance documents, you **MUST** read and apply these guidelines.

---

## Core Principles

### Be Specific and Actionable

Provide clear, concrete instructions rather than vague guidelines.

| Vague (Incorrect)             | Specific (Correct)                                                |
| ----------------------------- | ----------------------------------------------------------------- |
| "Write good tests"            | "Write unit tests for all utility functions using Vitest"         |
| "Use proper naming"           | "Use camelCase for variables, UPPER_CASE for constants"           |
| "Handle errors appropriately" | "Use try-catch for async operations, return Result type for sync" |

### Use RFC 2119 Keywords

Standardize requirement levels with these keywords:

| Keyword        | Meaning                            |
| -------------- | ---------------------------------- |
| **MUST**       | Absolute requirement               |
| **MUST NOT**   | Absolute prohibition               |
| **SHOULD**     | Recommended but not required       |
| **SHOULD NOT** | Not recommended but not prohibited |
| **MAY**        | Optional                           |

When using these keywords, **MUST** apply bold formatting (e.g., `**MUST**`, `**SHOULD NOT**`).

### Provide Examples

Show the AI what good outputs look like. Examples create consistency and quality.

- **MUST** keep examples concise to conserve AI context window
- **SHOULD** show only the essential pattern, not exhaustive variations
- **SHOULD** combine multiple small examples into one code block when possible

````markdown
### Function Style

**MUST** use function expressions:

```ts
// Correct
const calculateSum = (a: number, b: number): number => a + b;

// Incorrect
function calculateSum(a: number, b: number): number {
  return a + b;
}
```
````

### Translate User Intent Professionally

When defining rules based on user requests:

- **MUST** rephrase user requirements into professional, objective, unambiguous, and grammatically correct statements
- **MUST NOT** directly copy or translate user's informal wording
- **MUST** preserve the original intent without alteration
- **MUST** ask the user for clarification if the request is ambiguous before proceeding

| User Request (Informal)                      | Rule Definition (Professional)                                                 |
| -------------------------------------------- | ------------------------------------------------------------------------------ |
| "don't let AI change stuff it shouldn't"     | "**MUST NOT** modify code outside the scope of the current task"               |
| "make sure commits look nice"                | "**MUST** follow the commit message format specified in commit-message.md"     |
| "AI should ask if it doesn't know something" | "**MUST** request clarification when requirements are unclear or insufficient" |

---

## Document Structure

This section defines a minimal, extensible structure for AI guidance documents. While the primary example is `AGENTS.md`, these principles apply to any AI instruction file.

### Fixed Title Convention

| Document Type | Title Format                                             |
| ------------- | -------------------------------------------------------- |
| AGENTS.md     | `# AGENTS Guidelines for This Directory or Its Children` |
| Other         | Title **SHOULD** reflect the document's purpose          |

### Document Layout

A guidance document consists of only two parts:

1. **Header Block** - Title + brief context (what this directory/project is)
2. **Scenario Modules** - One H2 section per topic, separated by horizontal rules (`---`)

```markdown
# AGENTS Guidelines for This Directory or Its Children

Brief description of the directory/project context.

---

## [Scenario A]

Instructions for scenario A.

---

## [Scenario B]

Instructions for scenario B.
```

### Scenario Module Design

Each H2 section **MUST** handle exactly one scenario or topic. Keep modules:

- **Focused**: One concern per module (e.g., "Git Commit Messages", "Code Style", "Testing")
- **Self-contained**: Readers should understand the module without reading others
- **Actionable**: Provide clear instructions, not abstract principles

**Good scenario modules:**

- `## Git Commit Messages` - How to write commits
- `## Development Server` - How to run the dev environment
- `## Coding Conventions` - Style and naming rules
- `## Useful Commands` - Common CLI operations

**Avoid:**

- Mixing multiple concerns in one module
- Creating deeply nested subsections (H4+)
- Duplicating content that exists elsewhere (use references instead)

### Referencing External Documentation

When rules are defined elsewhere, reference them instead of duplicating:

```markdown
## Git Commit Messages

When generating Git commit messages, you **MUST** strictly follow the specifications in [.cursor/skills/commit-message/SKILL.md](../commit-message/SKILL.md). You **MUST NOT** reference any other commit message configurations, conventions, or formats (e.g., Angular commit guidelines, or repository commit history).
```

---

## Prompt Techniques

### Chain-of-Thought Prompting

Encourage step-by-step reasoning for complex tasks:

```markdown
When implementing a new feature:

1. First, understand the existing patterns in the codebase
2. Then, identify the files that need modification
3. Finally, implement changes following established conventions
```

### Define Clear Boundaries

Explicitly state what the AI should and should not do:

```markdown
### Scope of Changes

- **MUST** only make changes directly requested
- **MUST NOT** add features beyond what was asked
- **MUST NOT** refactor unrelated code
```

### Error Handling Instructions

Guide AI behavior when encountering issues:

```markdown
### When Encountering Issues

- If intent is unclear: ASK for clarification
- If code violates conventions: REPORT without modifying
- If type errors cannot be resolved: Use @ts-expect-error with reason
```

---

## Anti-Patterns to Avoid

### Overly Complex Prompts

**Incorrect:** Long paragraphs with multiple requirements mixed together
**Correct:** Structured sections with clear headings and bullet points

### Duplicate Documentation

**Incorrect:** Copying README content into AGENTS.md
**Correct:** Reference: "See [README.md](../../../README.md) for setup instructions"

### Implicit Assumptions

**Incorrect:** Assuming AI knows project conventions
**Correct:** Explicitly define all conventions with examples

---

## Formatting Best Practices

### Avoid Emoji in Professional Documentation

- **MUST NOT** use emoji characters in agent configuration files
- **SHOULD** use plain English text descriptors instead (e.g., "Correct/Incorrect")
- Emoji may render inconsistently across different platforms and tools
- Plain text ensures maximum compatibility and professionalism

**Rationale:** Agent configuration files serve as technical specifications that should maintain clarity and consistency across all viewing environments. Emoji characters can cause parsing issues, display inconsistently across different systems, and reduce the professional tone expected in technical documentation.

### Use Tables for Structured Data

```markdown
| Element   | Convention | Example           |
| --------- | ---------- | ----------------- |
| Variables | camelCase  | `userName`        |
| Constants | UPPER_CASE | `MAX_RETRY_COUNT` |
```

### Use Code Blocks for Commands and Examples

Always use fenced code blocks with language hints:

```typescript
// Example with syntax highlighting
const example = (): string => 'hello';
```

### Use Consistent Heading Hierarchy

```markdown
# Document Title (H1 - one per document)

## Major Section (H2)

### Subsection (H3)

#### Detail (H4 - use sparingly)
```

### Use Horizontal Rules Between H2 Sections

- **MUST** use `---` (horizontal rule) as the separator between the header block and the first H2 section, and between each subsequent H2 section
- **MUST NOT** use other separators such as HTML comments, `***`, `___`, or blank lines only

### Avoid Numbered Lists for Extensible Content

**SHOULD NOT** use numbered prefixes (e.g., `### 1. First Rule`) for sections that are expected to grow over time. Numbered lists create maintenance burden when items are added, removed, or reordered.

| Pattern         | Use When                             | Avoid When                          |
| --------------- | ------------------------------------ | ----------------------------------- |
| Numbered (`1.`) | Fixed sequence, steps, limited items | Open-ended lists, frequently edited |
| Unnumbered      | Extensible content, unordered items  | Sequential procedures               |

**Incorrect:**

```markdown
### 1. First Rule

### 2. Second Rule

### 3. Third Rule <!-- Adding a new rule requires renumbering -->
```

**Correct:**

```markdown
### First Rule

### Second Rule

### Third Rule <!-- New rules can be added anywhere -->
```

---

## Conflict Resolution

### Checklist Violation Handling

When any rule document contains a Checklist section, if existing code or content violates the Checklist conventions:

- **MUST** report the violation to the user
- **MUST NOT** modify the content without explicit user approval

This rule applies universally to all rule documents that include a Checklist.

### When User Requests Conflict with This Guide

If a user's explicit request conflicts with the conventions in this guide:

- **MUST** inform the user about the conflict
- **MUST** ask the user whether to:
  1. Adjust their request to comply with this guide, or
  2. Update this guide to accommodate the new requirement

---

## Checklist for AI Guidance Documents

The Checklist section **MUST** be placed at the end of the rule document as a standalone module. Use H3 headings for categorization.

### Structure Checklist

- [ ] H1 title follows the appropriate convention (standardized or functional)
- [ ] Brief context paragraph describing the scope
- [ ] Scenario modules (H2) - one topic per section
- [ ] Horizontal rules (`---`) after header block and between each H2 section
- [ ] No deeply nested subsections (avoid H4+)
- [ ] No numbered prefixes on extensible sections
- [ ] Checklist section (if present) is placed at the end as `## Checklist for AI Guidance Documents`

### Content Checklist

- [ ] Each module is focused and self-contained
- [ ] Instructions are specific and actionable
- [ ] Examples provided where helpful
- [ ] External documentation referenced (not duplicated)
- [ ] RFC 2119 keywords used consistently and bold (**MUST**, **SHOULD**, **MAY**)
- [ ] Rules are professionally worded (not direct copies of informal user requests)
- [ ] All content is written in English only (no other languages)

### Compliance Checklist

- [ ] Report violations to user when existing content conflicts with Checklist conventions
- [ ] Do not modify content without explicit user approval
