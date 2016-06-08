var StreamInjecter = require('stream-injecter');

module.exports = livereload;

function livereload(opts) {
  opts = opts || {};
  var port = opts.port || 35729;
  var src = opts.src || "' + (location.protocol || 'http:') + '//' + (location.hostname || 'localhost') + ':" + port + "/livereload.js?snipver=1";
  var snippet = "\n<script type=\"text/javascript\">document.write('<script src=\"" + src + "\" type=\"text/javascript\"><\\/script>')</script>\n";
  return (ctx, next) => next().then(() => {
    if (ctx.response.type && !ctx.response.type.includes('html')) return;

    if (opts.excludes) {
      var path = ctx.path;
      if (opts.excludes.some(exclude => path.startsWith(exclude))) return;
    }

    // Buffer
    if (Buffer.isBuffer(ctx.body)) {
      ctx.body = ctx.body.toString();
    }

    // string
    if (typeof ctx.body === 'string') {
      if (ctx.body.match(/livereload.js/)) return;
      ctx.body = ctx.body.replace(/<\/body>/, snippet + "<\/body>");
    }

    // stream
    if (ctx.body && typeof ctx.body.pipe === 'function') {
      var injecter = new StreamInjecter({
        matchRegExp : /(<\/body>)/,
        inject : snippet,
        replace : snippet + "$1",
        ignore : /livereload.js/
      });
      var size = +ctx.response.header['content-length'];

      if (size) ctx.set('Content-Length', size + snippet.length);
      ctx.body = ctx.body.pipe(injecter);
    }
  });
}
