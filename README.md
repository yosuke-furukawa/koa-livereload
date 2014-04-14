koa-livereload [![Build Status](https://travis-ci.org/yosuke-furukawa/koa-livereload.png)](https://travis-ci.org/yosuke-furukawa/koa-livereload)
==============

koa middleware for adding livereload script to the response body. 
no browser plugin is needed.


install
-------------

```shell
npm install koa-livereload --save-dev
```

How to use
-------------

this middleware can be used with a LiveReload server e.g. [grunt-contrib-watch](https://github.com/gruntjs/grunt-contrib-watch).

`koa-livereload` itself does not serve the `livereload.js` script.

## example

```js
  app.use(livereload());
```

## example with option

```js
  app.use(livereload({
    // if you change livereload server port, set "port" option
    port : 30211
  }));
```

```js
  app.use(livereload({
    // if you want to set livereload.js directly, set the "src" option
    src  : "http://localhost:35729/livereload.js?snipver=1"
  }));
```

```js
  app.use(livereload({
    // if you want certain paths to be excluded from injection (i.e. Angular partials/views path)
    excludes  : ['/partials']
  }));
```

credits
--------
* [LiveReload Creator](http://livereload.com/)

tests
-------

```shell
make test
```

license
------

MIT
