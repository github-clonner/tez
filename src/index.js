import './shim/string_includes';
import './shim/array_from';
import domClass from './dist/domClass';
import createElement from './dist/createElement';

const Tez = Object.assign(domClass, { createElement });

export { Tez };