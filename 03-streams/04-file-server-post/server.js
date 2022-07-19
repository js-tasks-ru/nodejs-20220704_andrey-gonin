const url = require('url');
const http = require('http');
const path = require('path');
const fs = require('fs');

const LimitSizeStream = require('./LimitSizeStream');

const server = new http.Server();

server.on('request', (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathname = url.pathname.slice(1);

  const filepath = path.join(__dirname, 'files', pathname);


  switch (req.method) {
    case 'POST': {

      if (fs.existsSync(filepath)) {
        res.statusCode = 409;
        res.end();
        return;
      }

      if (pathname.indexOf('/') !== -1) {
        res.statusCode = 400;
        res.end();
        return;
      }

      const limitedStream = new LimitSizeStream({limit: 10000, encoding: 'utf-8'});

      const stream = fs.createReadStream(filepath)
        .pipe(req)
        .pipe(limitedStream);

      stream.on('error', err => {
        res.statusCode = 413;
        res.end();
      });

      fs.writeFile(filepath, stream.toString(), (err) => {
        if (err) {
          console.log('err', err);
        }

        res.statusCode = 201;
        res.end();
      });


      break;
    }


    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

module.exports = server;
