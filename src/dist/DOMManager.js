let DOMManager = function( node ) {
	this.node = node;
	return this;
};
DOMManager.prototype = {
	getNode() {
		return this.node;
	}
	, logic( fn ) {
		this._logic = new Tez.LogicManager( fn );
		return this;
	}
	, logicArg( arg ) {
		this._logic.run.call( this._logic, arg );
		return this;
	}
	, logicMsg( fn ) {
		this._logic && this._logic.onMessage( fn.call( this, this.node ) );
		return this;
	}
	, getLogic() {
		return this._logic;
	}
	, composite( fn ) {
		this._composite = new Tez.CompositeManager( fn.bind( this ) );
		return this;
	}
	, compositeArg( arg ) {
		this._composite.run.call( this._composite, arg );
		return this;
	}
	, compositeMsg( fn ) {
		this._composite && this._composite.onMessage( fn.call( this, this.node ) );
		return this;
	}
	, getComposite() {
		return this._composite;
	}
};

export default DOMManager;