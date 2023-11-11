import {
  jsxIdentifier,
  jsxOpeningElement,
  jsxElement,
  jsxAttribute,
  jsxExpressionContainer,
  identifier,
  jsxClosingElement,
} from '@babel/types';
import unique from 'array-unique';

import type { Binding } from '@babel/traverse';
import type { JSXElement } from '@babel/types';

export type GenerateJSXElement = (
  name: string,
  data: { toInject: Binding[] }
) => JSXElement;

/**
 * Generates an AST node for a JSX Element with the provided name and attributes.
 *
 * It creates a JSX element, capitalizing the first letter of the provided name
 * to adhere to the JSX convention for component names. The attributes for
 * the element are derived from the `toInject` array present in the provided `data`
 * object. Each attribute is constructed with its name and value mapped directly
 * from the `identifier` properties in the `toInject` array.
 *
 * @param name - The name of the JSX Element to be created.
 * @param data - An object containing relevant data, containing bindings to be injected.
 * @returns - A JSX element AST node with the provided name and attributes.
 *
 * @example
 * // Assuming data.toInject = [{ identifier: { name: 'attr1' } }, { identifier: { name: 'attr2' } }]
 * const jsxElementNode = generateJSXElement('exampleElement', data);
 * // jsxElementNode represents: <ExampleElement attr1={attr1} attr2={attr2} />
 */
export const generateJSXElement: GenerateJSXElement = (name, data) => {
  name = name.charAt(0).toUpperCase() + name.slice(1);
  const toInject = unique(data.toInject);
  const props = toInject.map((binding) =>
    jsxAttribute(
      jsxIdentifier(binding.identifier.name),
      jsxExpressionContainer(identifier(binding.identifier.name)) // Use identifier instead of jsxIdentifier
    )
  );

  const jsxId = jsxIdentifier(name);
  const openingElement = jsxOpeningElement(jsxId, props, true);
  const closingElement = jsxClosingElement(jsxId);
  return jsxElement(openingElement, null, [], true);
};
