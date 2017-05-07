# CHANGELOG

## v9.2.1

## BREAKING CHANGE
* Deprecated `<Tez method="Data">`, use [SilentData](https://www.npmjs.com/package/silentdata)
* Deprecated `<Tez method="XHR">`, use [xhr](https://www.npmjs.com/package/xhr) or [node-fetch](https://www.npmjs.com/package/node-fetch)
* Deprecated `<Tez method="State">`, use [SilentData](https://www.npmjs.com/package/silentdata)
* Deprecated `<Tez method="Hash">`, use [xhr](https://www.npmjs.com/package/xhr) or [node-fetch](https://www.npmjs.com/package/node-fetch)
* Deprecated `<Tez method="URLComponent">`, use [navigo](https://github.com/krasimir/navigo) or [riot-route](http://riotjs.com/api/route/)

## New
* Now `domClass` works as default constructor
* feat(options): new `disableSafeParse` option for enabling HTML parsing, else it will do only text changing

## Size
* size slightly reduced

## v5.1.3

## BREAKING CHANGE
* deprecated(tezClass): you can now use `domClass` with components to achieve that
* deprecated(polyfills): starting at *v4.0.0*, `tez.js` doesn't provides support to IE<11 and older browsers
* deprecated(managers): managers removed due of less usage, so i removed it. if you need that, you can look at `v2.x.x`

## Fixes
* fix(yarn): deps updated
* fix(core): `Tez.Data` fixed and improved

## New
* feat(core::state): New `Tez.State` for super-stateful components

## Improvements
* improved(core): `Tez.Data` improved

## Size
* size slightly, almost `2x` lesser size



## NOTE
CHANGELOG starts at *v5.x.x*