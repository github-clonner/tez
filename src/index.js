import './shim/string_includes'; // warn: this is not-security
import './shim/array_from'; // warn: this is not-security
import domClass from './dist/domClass';
import createElement from './dist/createElement';

const Tez = Object.assign(domClass, { createElement });

export { Tez };