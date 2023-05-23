'use strict';

module.exports = {
  conf: {},
  rs: {
    PutPolicy: jest.fn(function () {
      return {
        token: function token() {
          return 'mockToken';
        }
      };
    })
  },
  io: {
    PutExtra: jest.fn(function () {
      return 'mockExtra';
    }),
    putFile: jest.fn(function (token, key, existsAt, extra, cb) {
      process.nextTick(cb());
    })
  }
};
//# sourceMappingURL=qiniu.js.map