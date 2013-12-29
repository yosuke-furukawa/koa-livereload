var koa = require('koa');
var route = require('koa-route');
var serve = require('koa-static');
var views = require('co-views');
var livereload = require('../.');
var app = koa();

var render = views(__dirname + '/views', { map : {html : 'jade'}});

app.use(livereload());

// GET /views => render template engine
app.use(route.get('/views', function *(next) {
  this.body = yield render('index.jade', {name: "koa"});
}));

// GET /hello => 'Hello!'
app.use(route.get('/hello', function *() {
  this.body = 'Hello!!';
}));

// GET /hello/:name => 'Hello :name'
app.use(route.get('/hello/:name', function *(name) {
  this.body = 'Hello ' + name;
}));


// static file serv
app.use(serve(__dirname + '/public'));

app.use(function *(next) {
  if (this.request.url === "/_chk") {
     console.log("OK");
     this.response.status = 200;
     this.response.body = "OK";
  }
  yield next;
});

// handle error
app.use(function *(next) {
  try {
    yield next;
  } catch (err) {
    this.status = 500;
    this.body = err.message;
    this.app.emit("error", err, this);
  }
});

// error thrower
app.use(function *(next) {
  if (this.url === "/_err") {
    throw new Error("Send Error");
  }

  yield next;
});


app.on('error', function(err){
  console.error(err.stack);
});


app.listen(3002);
