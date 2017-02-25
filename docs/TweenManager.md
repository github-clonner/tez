# Docs for Tez

## TweenManager

### Usage

```javascript

	let tween = Tez.TweenManager({
		x: 0,
		y: 40
	}, {
		x: -20,
		y: 20
	});

	console.log(tween(0.5));

	/*
	{
		x: -10,
		y: 30
	}
	*/

```

### Returns

* Tweened updated value