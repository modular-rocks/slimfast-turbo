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

import type { RandomObject } from '../../../../../../types';

/**
 * Generates an AST node for a JSX Element with provided name and attributes.
 *
 * It creates a JSX element, capitalizing the first letter of the provided name
 * to adhere to the JSX convention for component names. The attributes for
 * the element are derived from the `toInject` array present in the provided `data`
 * object. Each attribute is constructed with its name and value mapped directly
 * from the respective properties in the `toInject` array.
 *
 * @param name - The name of the JSX Element to be created.
 * @param data - An object containing relevant data, including an array `toInject` which consists of objects that hold attribute information.
 * @returns - A JSX element AST node with the provided name and attributes.
 *
 * @example
 * // Assuming data.toInject = [{ identifier: { name: 'attr1' } }, { identifier: { name: 'attr2' } }]
 * const jsxElementNode = generateJSXElement('exampleElement', data);
 * // jsxElementNode represents: <ExampleElement attr1={attr1} attr2={attr2} />
 */
export const generateJSXElement = (name: string, data: RandomObject) => {
  name = name.charAt(0).toUpperCase() + name.slice(1);
  // TODO: Refactor to use a more specific type than 'any' for the toInject array
  const toInject: any[] = unique(data.toInject);
  const props = toInject.map((x: RandomObject) =>
    jsxAttribute(
      jsxIdentifier(x.identifier.name),
      jsxExpressionContainer(identifier(x.identifier.name)) // Use identifier instead of jsxIdentifier
    )
  );

  const jsxId = jsxIdentifier(name);
  const openingElement = jsxOpeningElement(jsxId, props, true);
  const closingElement = jsxClosingElement(jsxId);
  return jsxElement(openingElement, null, [], true);
};
