//Code adapted from https://gist.github.com/Dynalon/a8790a1fa66bfd2c26e1
// Then improved by @dalisoft for tez.js

import _parseString from './str2node';
import Component from './Component';
import Tez from './domClass';

// Minimal nothing function
const {
	yep,
	nope
} = {
	yep: function yep() {},
	nope: function nope() {}
};

const document = typeof(window) !== "undefined" ? window.document : {
	createElement: (elem) => {
		return {
			tagName: elem.toUpperCase(),
			setAttribute: nope
		}
	}
};

export default function createElement(tagName, attributes, ...children) {

	if (!tagName)
		throw new Error("tagName has to be defined, non-empty string");

	children = children || [];
	attributes = attributes || [];

	if (!(this instanceof createElement)) {
		return new createElement(tagName, attributes, ...children);
	}

	if (typeof tagName === "function") {
		return {constructor:tagName, attrs:attributes, childs: children};
	}

	if (typeof tagName !== "string" && typeof tagName !== "number" && tagName && tagName instanceof Component) {
		tagName.setProps(attributes);
	}

	let element = `<${tagName}`;
	let attrKeys = Object.keys(attributes);

	attrKeys.map((attribute_key, i) => {
		let attribute_value = attributes[attribute_key];
		element += ` ${attribute_key}="${attribute_value}"`;
	});

	element += `>`;

	children.map(child => {
		if (child instanceof HTMLElement)
			element += child.outerHTML;
		else if (typeof child === "object" && child.instance instanceof createElement) {
			element += child.element;
		} else if (typeof child === 'string' || typeof child === 'number') {
			if (child.includes(" ")) {
				child.split(" ").map(childS => {
					element += `<span>${childS}</span> `;
				});
			} else {
			element += `<span>${child}</span>`;
			}
		} else {
			if (child.constructor) {
			element += Tez.getComponentRendered(child);
			}
		}
	});
	element += `</${tagName}>`;


	return {
		instance: this,
		element
	};
	}
