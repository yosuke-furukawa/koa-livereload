var request = require('supertest');
var assert = require('assert');
var http = require('http');
var koa = require('koa');
var serve = require('koa-static');
var Stream = require('stream');
var fs = require('fs');
var path = require('path');
var livereload = require('./index.js');

describe("Livereload", function() {
  var html = '<html><body><h1>TEXT HTML<\/h1><\/body><\/html>';
  var port = 35729;
  var src = "' + (location.protocol || 'http:') + '//' + (location.hostname || 'localhost') + ':" + port + "/livereload.js?snipver=1";
  var snippet = "\n<script type=\"text/javascript\">document.write('<script src=\"" + src + "\" type=\"text/javascript\"><\\/script>')</script>\n";
  var expectHtml = '<html><body><h1>TEXT HTML<\/h1>'+ snippet +'<\/body><\/html>';
  fs.writeFileSync(__dirname + "/expect.html", html);

  function* streamHtml(next) {
    this.response.type = "text/html";
    this.body = fs.createReadStream(__dirname + "/expect.html");
  }

  function* textHtml(next) {
    this.body = html;
  }

  function* bufferHtml(next) {
    this.body = html;
  }

  it('should contain livereload text', function (done) {
    var app = koa();
    app.use(livereload());
    app.use(textHtml);
    request(app.listen())
    .get('/')
    .expect(200)
    .end(function (err, res) {
      if (err) return done(err);

      res.text.should.equal(expectHtml);
      done();
    });
  });
  
  it('should not contain livereload text on excluded path', function (done) {
    var app = koa();
    app.use(livereload({excludes: ['/partials']}));
    app.use(textHtml);
    request(app.listen())
    .get('/partials/posts.html')
    .expect(200)
    .end(function (err, res) {
      if (err) return done(err);

      res.text.should.not.equal(expectHtml);
      done();
    });
  });

  it('should contain livereload buffer', function (done) {
    var app = koa();
    app.use(livereload());
    app.use(bufferHtml);
    request(app.listen())
    .get('/')
    .expect(200)
    .end(function (err, res) {
      if (err) return done(err);

      res.text.should.equal(expectHtml);
      done();
    });
  });

  it('should contain livereload static middleware', function (done) {
    var app = koa();
    app.use(livereload());
    app.use(serve(__dirname));
    request(app.listen())
    .get('/expect.html')
    .expect(200)
    .end(function (err, res) {
      if (err) return done(err);

      res.text.should.equal(expectHtml);
      done();
    });
  });

  it('should contain livereload stream', function (done) {
    var app = koa();
    app.use(livereload());
    app.use(streamHtml);
    request(app.listen())
    .get('/')
    .expect(200)
    .end(function (err, res) {
      if (err) return done(err);

      res.text.should.equal(expectHtml);
      done();
    });
  });
  it('should contain livereload stream with port option', function (done) {
    var app = koa();
    var port = 32322;
    var src = "' + (location.protocol || 'http:') + '//' + (location.hostname || 'localhost') + ':" + port + "/livereload.js?snipver=1";
    var snippet = "\n<script type=\"text/javascript\">document.write('<script src=\"" + src + "\" type=\"text/javascript\"><\\/script>')</script>\n";
    var expectHtml = '<html><body><h1>TEXT HTML<\/h1>'+ snippet +'<\/body><\/html>';
    app.use(livereload({port:port}));
    app.use(streamHtml);
    request(app.listen())
    .get('/')
    .expect(200)
    .end(function (err, res) {
      if (err) return done(err);

      res.text.should.equal(expectHtml);
      done();
    });
  });
  it('should contain livereload stream with src option', function (done) {
    var app = koa();
    var src = "abc.js";
    var snippet = "\n<script type=\"text/javascript\">document.write('<script src=\"" + src + "\" type=\"text/javascript\"><\\/script>')</script>\n";
    var expectHtml = '<html><body><h1>TEXT HTML<\/h1>'+ snippet +'<\/body><\/html>';
    app.use(livereload({src : src}));
    app.use(streamHtml);
    request(app.listen())
    .get('/')
    .expect(200)
    .end(function (err, res) {
      if (err) return done(err);

      res.text.should.equal(expectHtml);
      done();
    });
  });
});
