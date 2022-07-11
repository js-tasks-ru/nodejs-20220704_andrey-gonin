const stream = require('stream');
const os = require('os');

class LineSplitStream extends stream.Transform {
  constructor(options) {
    super(options);

    this.output = '';
  }

  _transform(chunk, encoding, callback) {

    let strChunk = chunk.toString();
    let temp = [];

    if (strChunk.indexOf(os.EOL) < 0) {
      this.output += strChunk;
    } else {
      temp = strChunk.split(os.EOL);

      while (temp.length - 1) {
        this.output += temp.shift()
        this.push(this.output);
        this.output = '';
      }
      this.output += temp.shift();
    }

    return callback();
  }

  _flush(callback) {
    this.push(this.output);
    callback();
  }
}

module.exports = LineSplitStream;
