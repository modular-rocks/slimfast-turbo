import type { Builder } from './slimfast/pipeline/build/builder';
import type { NamerGenerator } from './slimfast/pipeline/name/default-function-name-generator';
import type { Visitor } from './slimfast/visitors/visitor';
import type { Binding, NodePath } from '@babel/traverse';
import type { Node, Statement } from '@babel/types';
import type { CodebaseOpts } from '@modular-rocks/workspace-node/types';

export type RandomObject = Record<string, any>;

/**
 * Type that ensures that all properties K of T are present.
 *
 * @template T - The base type from which properties are extracted.
 * @template K - A subset of the keys from T.
 *
 * @example
 * type Data = { toInject: Binding[], ast: Node };
 * type RequiredData = MandatoryKeys<Data, 'toInject'>;
 * // { toInject: Binding[] }
 */
type MandatoryKeys<T, K extends keyof T> = {
  [P in K]: T[P];
};

/**
 * Type that checks if a given type T is a key of {@link ConstraintData}. If it's not, it resolves to never.
 *
 * @template T - The type to check against ConstraintData.
 *
 * @example
 * type MyKey = 'toInject';
 * type CheckedKey = IsAnyKey<MyKey>;  // 'toInject'
 */
type IsAnyKey<T> = T extends keyof ConstraintData ? T : never;

/**
 * Represents a constraint function that takes an AST node path and returns a boolean.
 *
 * @param path - The Abstract Syntax Tree (AST) node path.
 * @returns A boolean indicating if the provided path meets the constraint.
 */
export type Constraint = (path: NodePath) => boolean;

/**
 * Represents a constraint function that takes an AST node path and additional constraint data.
 * The constraint data keys can be customized but must be a subset of {@link ConstraintData}.
 *
 * By default, it considers all keys of {@link ConstraintData}.
 *
 * @template K - A subset of the keys from ConstraintData. Default is all keys from ConstraintData.
 * @param path - The Abstract Syntax Tree (AST) node path.
 * @param data - The additional constraint data associated with the node path.
 * @returns A boolean indicating if the provided path and data meet the constraint.
 *
 * @example
 * const constraintFunction: ConstraintWithData<'toInject'> = (path, data) => {
 *   const bindings = data.toInject;
 *   // Perform checks using the `bindings` and return a boolean.
 *   return true;
 * };
 */
export type ConstraintWithData<
  K extends keyof ConstraintData = keyof ConstraintData,
> = (
  path: NodePath,
  data: MandatoryKeys<ConstraintData, IsAnyKey<K>>
) => boolean;

/**
 * Default data structure that contains properties commonly used in constraints.
 */
type DefaultConstraintData = {
  toInject: Binding[];
  toImport: Binding[];
  ast: Node;
};

/**
 * Represents constraint data with a custom subset of {@link DefaultConstraintData} keys.
 *
 * By default, it includes all keys of {@link DefaultConstraintData}.
 *
 * @template K - A subset of the keys from DefaultConstraintData. Default is all keys from DefaultConstraintData.
 *
 * @example
 * type MyConstraintData = ConstraintData<'toInject' | 'ast'>;
 * // { toInject: Binding[], ast: Node }
 */
export type ConstraintData<
  K extends keyof DefaultConstraintData = keyof DefaultConstraintData,
> = MandatoryKeys<DefaultConstraintData, K>;

/**
 * Represents an array of constraint functions, with or without options,
 * used to validate and process AST node paths in a specific context.
 */
export type Constraints = (Constraint | ConstraintWithData)[];

export type SlimFastOpts = CodebaseOpts & {
  visitors?: (typeof Visitor)[];
  namer?: NamerGenerator;
  builder?: Builder;
};

export type VisitorOpts = {
  blocklistedParents: string[];
  toImport: Binding[];
  toInject: Binding[];
};

export type ProvisionalFile = {
  pathname: string;
  ast: RandomObject;
  import: Statement;
};

export type {
  Builder,
  BuilderData,
  BuilderOpts,
} from './slimfast/pipeline/build/builder';
