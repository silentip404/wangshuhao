import {
  capitalize,
  split,
  toCamelCase,
  toKebabCase,
  toLowerCase,
  toSnakeCase,
  toTitleCase,
  toUpperCase,
} from 'remeda';

const NEWLINE = '\n' as const;

const splitLines = (text: string): string[] => split(text, /\r\n|\r|\n/v);

interface CaseVariants {
  [`camelCase`]: string;
  [`kebab-case`]: string;
  [`PascalCase`]: string;
  [`raw`]: { [`lowercase`]: string; [`UPPERCASE`]: string; [`value`]: string };
  [`SCREAMING_SNAKE_CASE`]: string;
  [`snake_case`]: string;
  [`Title Case`]: string;
}

const getSanitizedCaseVariants = (raw: string): CaseVariants => {
  const sanitized = raw.replaceAll(/[^0-9a-z]/giv, ' ');

  return {
    [`raw`]: {
      [`value`]: raw,
      [`lowercase`]: toLowerCase(raw),
      [`UPPERCASE`]: toUpperCase(raw),
    },

    [`camelCase`]: toCamelCase(sanitized),
    [`PascalCase`]: capitalize(toCamelCase(sanitized)),
    [`kebab-case`]: toKebabCase(sanitized),
    [`snake_case`]: toSnakeCase(sanitized),
    [`SCREAMING_SNAKE_CASE`]: toUpperCase(toSnakeCase(sanitized)),
    [`Title Case`]: toTitleCase(sanitized),
  };
};

export type { CaseVariants };
export { getSanitizedCaseVariants, NEWLINE, splitLines };
