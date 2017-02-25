# Docs for Tez

## URLComponent

### Options
* `async` - Ajax `async` method
* `prefixURL` - hashURL prefix option
* `loadRealLink` - if this option is `true` function forcely calls to real link

### Methods
* `request` - request link ajax/load/send
* `then` - callback for result of `request`

### Usage

```javascript

	let urlc = new URLComponent();
		url.request('send.php').then(function(result){
			if (this.readyCode === 4) {
				alert(this.responseText);
			}
		});

```

### Returns

* Nothing returns