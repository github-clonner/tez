//Code adapted from https://gist.github.com/Dynalon/a8790a1fa66bfd2c26e1
// Then improved by @dalisoft for tez.js
let createElement = (tagName, attributes, ...children) => {

    if (!tagName || typeof tagName !== 'string')
        throw new Error("tagName has to be defined, non-empty string");

	children = children || [];
	attributes = attributes || [];

    let element = document.createElement(tagName);
	let attrKeys = Object.keys(attributes);

	attrKeys.map(attribute_key => {
        let attribute_value = attributes[attribute_key];
        element.setAttribute(attribute_key, attribute_value);
    });

	children.map(child => {
        if (child instanceof HTMLElement)
            element.appendChild(child);
        else if (typeof child === 'string' || typeof child === 'number')
            element.appendChild(document.createTextNode(child));
    });

    return element;
}

export default createElement;