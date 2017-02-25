# Docs for Tez

## getDecPow

### Usage

```javascript

	let numb = Tez.getDecPow(4); // 4-decimal => returns 10000
	
	let val = 0.2505743542;
	
		val = Math.round(val * numb) / numb;

	// val = 0.2505;

```

### Returns

* - number of power for use of decimal