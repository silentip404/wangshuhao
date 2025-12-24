import { capitalize, split, toCamelCase } from 'remeda';

const splitLines = (text: string): string[] => split(text, /\r\n|\r|\n/v);

interface CaseVariants {
  camelCase: string;
  pascalCase: string;
  raw: string;
}

const getSanitizedCaseVariants = (raw: string): CaseVariants => {
  const sanitized = raw.replace(/[^0-9a-z]/giv, ' ');

  const camelCase = toCamelCase(sanitized);
  const pascalCase = capitalize(camelCase);

  return { camelCase, pascalCase, raw };
};

export type { CaseVariants };
export { getSanitizedCaseVariants, splitLines };
