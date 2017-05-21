import './shim/string_includes'; // warn: this is not-security
import './shim/array_from'; // warn: this is not-security

import Tez from './dist/domClass';
import createElement from './dist/createElement';
import makeNode from './dist/makeNode';
import Component from './dist/Component';

const TezGlobal = Object.assign(Tez, { createElement, customElement: makeNode, Component });

export default TezGlobal;