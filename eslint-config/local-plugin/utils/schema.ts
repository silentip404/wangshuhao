import { type JSONSchema4 } from '@typescript-eslint/utils/json-schema';
import { type FromSchema, type JSONSchema } from 'json-schema-to-ts';

type UnionJSONSchema = JSONSchema & JSONSchema4;

const defineUnionJSONSchema = <const T extends UnionJSONSchema>(t: T): T => t;

const createESLintSchema = <const T extends UnionJSONSchema>(t: T): [T] => [t];

type InferSchema<T extends [UnionJSONSchema]> = [FromSchema<T['0']>];

export { createESLintSchema, defineUnionJSONSchema, type InferSchema };
