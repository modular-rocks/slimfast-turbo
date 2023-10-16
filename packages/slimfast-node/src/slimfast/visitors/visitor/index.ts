import traverse, { NodePath, Node } from '@babel/traverse';

import { rejectParentsWithTypes } from '../utils/reject-parents-with-types';
import { notInExtracted } from '../utils/not-in-extracted';

import type { RandomObject } from '../../../types';

/**
 * The Visitor class is responsible for traversing the AST and managing extraction based on
 * provided constraints and blocklisted parent types.
 */
export class Visitor {
  /**
   * A map storing extracted nodes from the AST.
   */
  extracted: Map<NodePath, any>;

  /**
   * The abstract syntax tree that the Visitor will traverse.
   */
  ast: Node | undefined;

  /**
   * Options passed to the Visitor.
   */
  opts: RandomObject;

  /**
   * Stateful information for the Visitor.
   */
  state: RandomObject;

  /**
   * Initializes the Visitor instance with the provided abstract syntax tree (AST), options,
   * state information, and a map of extracted nodes. It also triggers the traversal of the AST.
   *
   * @param ast - The abstract syntax tree to be traversed by the visitor.
   * @param opts - Configuration options provided to the Visitor.
   * @param state - Stateful information to manage the extraction and traversal.
   * @param extracted - A map storing nodes that have been extracted from the AST.
   *
   * @example
   * const visitor = new Visitor(ast, options, state, extractedNodes);
   */
  constructor(
    ast: Node | undefined,
    opts: RandomObject,
    state: RandomObject,
    extracted: Map<NodePath, any>
  ) {
    this.ast = ast;
    this.extracted = extracted;
    this.state = state;
    this.opts = opts;
    this.traverse();
  }

  /**
   * Provides a list of constraint functions to be applied during AST traversal.
   * Each constraint function is expected to check specific conditions on AST nodes.
   * By default, this method returns an empty array, meaning no constraints are applied.
   * It's intended to be overridden by subclasses or instances to provide specific constraints.
   *
   * A constraint function should return `true` if the provided AST node violates the constraint,
   * and `false` otherwise.
   *
   * @returns An array of constraint functions.
   *
   * @example
   * // A constraint to check if a node type is 'Identifier'
   * function isIdentifier(path) {
   *   return path.type === 'Identifier';
   * }
   *
   * // Overriding constraints in a subclass or instance
   * constraints() {
   *   return [isIdentifier];
   * }
   */
  constraints(): Function[] {
    return [];
  }

  /**
   * Provides a list of blocklisted parent node types that should be avoided during AST traversal.
   * These types represent parent nodes that, if encountered, will cause the current node to be
   * considered ineligible for extraction.
   *
   * The blocklisted parent types can be provided via the `opts` object during instantiation,
   * or a default list is used if none are provided.
   *
   * @returns An array of blocklisted parent node types.
   */
  blocklistedParents(): string[] {
    return (
      this.opts.blocklistedParents || [
        'ImportDeclaration',
        'TypeParameterDeclaration',
      ]
    );
  }

  /**
   * Checks if a given AST node (`path`) passes all the constraints defined by the `constraints` method.
   * If the node violates any single constraint, this method returns `false`.
   *
   * @param path - The AST node to be checked.
   * @param data - Additional data or context related to the AST node.
   * @returns Returns `true` if the node passes all constraints, otherwise `false`.
   *
   */
  passesContraints(path: NodePath, data: RandomObject): Boolean {
    if (
      this.constraints().some((constraint: Function) =>
        constraint(path, data, this.opts, this.ast)
      )
    ) {
      return false;
    }

    return true;
  }

  /**
   * Determines if a given AST node (`path`) is ineligible for processing.
   *
   * A node is considered ineligible if:
   *  - It doesn't have a parent node.
   *  - It has already been extracted.
   *  - It has a parent of a blocklisted node type.
   *
   * @param path - The AST node to check for eligibility.
   * @returns Returns `true` if the node is ineligible, `false` if it is eligible, and `null` if the node has no parent.
   */
  notEligible(path: NodePath): Boolean | null {
    const eligible =
      path.parentPath &&
      notInExtracted(path, this.extracted) &&
      rejectParentsWithTypes(path, this.blocklistedParents());
    return !eligible;
  }

  /**
   * Evaluates the eligibility of a given AST node (`path`) for extraction and extracts it if applicable.
   *
   * The method checks:
   * 1. If the node is ineligible using the `notEligible` method.
   * 2. If the node or any of its parent nodes pass the constraints set by the `passesContraints` method.
   *
   * If the node itself or any of its parent nodes pass the constraints, the node (or the qualifying parent) is added
   * to the `extracted` map, which keeps track of all nodes that have been extracted.
   *
   * @param path - The AST node to be evaluated for extraction.
   */
  test(path: NodePath): void {
    if (this.notEligible(path)) return;

    let parent: NodePath | null = path;

    while (parent) {
      const data: RandomObject = {};
      if (this.passesContraints(parent, data)) {
        this.extracted.set(parent, data);
        return;
      }
      parent = parent.parentPath;
    }
  }

  /**
   * Provides the visitor methods for the Abstract Syntax Tree (AST) traversal.
   * Each method in the returned object specifies how to process a particular type of AST node.
   *
   * @returns An object where keys represent AST node types and values are functions
   * detailing how to process those nodes.
   *
   * @example
   * // Overriding `visit` in a subclass or instance to process 'Expression' nodes
   * visit() {
   *   return {
   *     Expression(path: NodePath) {
   *       // Custom processing logic for 'Expression' nodes
   *     }
   *   };
   * }
   */
  visit(): RandomObject {
    // TODO: maybe use composition to fix this
    // eslint-disable-next-line no-console
    console.warn('Override this method, this is just an example');
    return {};
  }

  /**
   * Initiates the traversal of the Abstract Syntax Tree (AST) using the provided visitor methods.
   *
   * The `traverse` method goes through each node of the AST and applies the corresponding visitor
   * methods defined in the `visit` method. If an AST is not provided, the traversal
   * will not occur.
   */
  traverse(): void {
    if (!this.ast) return;
    traverse(this.ast, this.visit());
  }

  /**
   * Converts and returns the extracted nodes from the AST as an array.
   *
   * The `extracted` property of the `Visitor` class is a map that keeps track of nodes
   * which have been extracted during AST traversal. This method provides these nodes
   * in an array format.
   *
   * @returns An array of extracted nodes. Each item in the
   * array is a tuple where the first element is the node path and the second element
   * is associated data or context for that node.
   */
  extract() {
    return Array.from(this.extracted);
  }
}
