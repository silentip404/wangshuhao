import type { JSONSchema4 } from '@typescript-eslint/utils/json-schema';
import type { FromSchema, JSONSchema } from 'json-schema-to-ts';

type UnionJsonSchema = JSONSchema & JSONSchema4;

const defineUnionJsonSchema = <const T extends UnionJsonSchema>(
  unionJsonSchema: T,
): T => unionJsonSchema;

const createESLintSchema = <const T extends UnionJsonSchema>(
  unionJsonSchema: T,
): [T] => [unionJsonSchema];

type InferSchema<T extends [UnionJsonSchema]> = [FromSchema<T['0']>];

export type { InferSchema };
export { createESLintSchema, defineUnionJsonSchema };
