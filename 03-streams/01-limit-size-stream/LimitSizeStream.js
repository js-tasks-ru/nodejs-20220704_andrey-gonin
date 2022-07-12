const stream = require('stream');
const LimitExceededError = require('./LimitExceededError');

class LimitSizeStream extends stream.Transform {
  constructor(options) {
    super(options);

    this.limit = options.limit;
    this.count = 0;
  }

  _transform(chunk, encoding, callback) {
    this.count += chunk.length;

    callback(
      this.count > this.limit ? new LimitExceededError() : null,
      chunk,
    );
  }
}

module.exports = LimitSizeStream;
