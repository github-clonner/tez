let CompositeManager = ( draw, args ) => new Tez.FunctionManager( draw, "raf" )
	.run( args );
let LogicManager = ( fn, args ) => new Tez.FunctionManager( fn, "Worker" )
	.run( args );
let CallManager = ( fn, args ) => new Tez.FunctionManager( fn )
	.run( args );

export { CompositeManager, LogicManager, CallManager };