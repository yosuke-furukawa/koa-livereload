var StreamInjecter = require('stream-injecter');

module.exports = livereload;

function livereload(opts) {
  opts = opts || {};
  var port = opts.port || 35729;
  var src = opts.src || "' + (location.protocol || 'http:') + '//' + (location.hostname || 'localhost') + ':" + port + "/livereload.js?snipver=1";
  var snippet = "\n<script type=\"text/javascript\">document.write('<script src=\"" + src + "\" type=\"text/javascript\"><\\/script>')</script>\n";
  return function *livereload(next) {
    yield* next;

    if (this.response.type && this.response.type.indexOf('html') < 0) return;

    // Buffer
    if (Buffer.isBuffer(this.body)) {
      this.body = this.body.toString();
    }

    // string
    if (typeof this.body === 'string') {
      if (this.body.match(/livereload.js/)) return;
      this.body = this.body.replace(/<\/body>/, snippet + "<\/body>");
    }

    // stream
    if (typeof this.body.pipe === 'function') {
      var injecter = new StreamInjecter({
        matchRegExp : /(<\/body>)/,
        inject : snippet,
        replace : snippet + "$1",
        ignore : /livereload.js/
      });
      this.body = this.body.pipe(injecter);
    }
  };
}
