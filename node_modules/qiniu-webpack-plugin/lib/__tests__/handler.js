'use strict';

var _QiniuPlugin = require('../QiniuPlugin');

var _QiniuPlugin2 = _interopRequireDefault(_QiniuPlugin);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe('handler', function () {
  var handler = null;

  describe('withOut filter', function () {
    /**
     * 在每个测试之前重置 handler
     */
    beforeEach(function () {
      var plugin = new _QiniuPlugin2.default({
        ACCESS_KEY: 'a',
        SECRET_KEY: 's',
        bucket: 'b'
      });
      var compiler = {
        plugin: function plugin(event, cb) {
          handler = cb;
        }
      };
      plugin.apply(compiler);
    });

    it('without filter', function (done) {
      var qiniu = require('qiniu'); // eslint-disable-line global-require
      handler({
        assets: {
          a: {
            emitted: true,
            existsAt: 'mockExistsAt'
          },
          b: {
            emitted: true,
            existsAt: 'mockExistsAt'
          }
        },
        hash: 'mockHash'
      }, done);
      expect(qiniu.io.putFile).toHaveBeenCalledTimes(2);
      expect(qiniu.io.putFile.mock.calls[0].slice(0, 3)).toEqual(['mockToken', 'mockHash/a', 'mockExistsAt']);
      expect(qiniu.io.putFile.mock.calls[1].slice(0, 3)).toEqual(['mockToken', 'mockHash/b', 'mockExistsAt']);
    });
  });

  describe('with string and regex filter', function () {
    /**
     * 在每个测试之前重置 handler
     */
    beforeEach(function () {
      var plugin = new _QiniuPlugin2.default({
        ACCESS_KEY: 'a',
        SECRET_KEY: 's',
        bucket: 'mockBucket',
        path: '[hash]',
        log: jest.fn(),
        include: ['a', /^c$/]
      });
      var compiler = {
        plugin: function plugin(event, cb) {
          handler = cb;
        }
      };
      plugin.apply(compiler);
    });

    it('with filter', function (done) {
      var qiniu = require('qiniu'); // eslint-disable-line global-require
      qiniu.io.putFile.mockClear();
      qiniu.rs.PutPolicy.mockClear();
      handler({
        assets: {
          a: {
            emitted: true,
            existsAt: 'mockExistsAt'
          },
          b: {
            emitted: true,
            existsAt: 'mockExistsAt'
          },
          c: {
            emitted: true,
            existsAt: 'mockExistsAt'
          }
        },
        hash: 'mockHash'
      }, done);

      expect(qiniu.rs.PutPolicy).toHaveBeenCalledTimes(2);
      expect(qiniu.rs.PutPolicy.mock.calls).toEqual([['mockBucket:mockHash/a'], ['mockBucket:mockHash/c']]);

      expect(qiniu.io.putFile).toHaveBeenCalledTimes(2);
      expect(qiniu.io.putFile.mock.calls[0].slice(0, 3)).toEqual(['mockToken', 'mockHash/a', 'mockExistsAt']);
      expect(qiniu.io.putFile.mock.calls[1].slice(0, 3)).toEqual(['mockToken', 'mockHash/c', 'mockExistsAt']);
    });
  });

  describe('error', function () {
    /**
     * 在每个测试之前重置 handler
     */
    beforeEach(function () {
      var plugin = new _QiniuPlugin2.default({
        ACCESS_KEY: 'a',
        SECRET_KEY: 's',
        bucket: 'mockBucket'
      });
      var compiler = {
        plugin: function plugin(event, cb) {
          handler = cb;
        }
      };
      plugin.apply(compiler);
    });

    it('when put file', function (done) {
      var qiniu = require('qiniu'); // eslint-disable-line global-require
      qiniu.io.putFile.mockClear();
      qiniu.io.putFile = jest.fn(function () {
        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }

        args[args.length - 1](new Error('error'));
      });
      qiniu.rs.PutPolicy.mockClear();
      handler({
        assets: {
          a: {
            emitted: true,
            existsAt: 'mockExistsAt'
          }
        },
        hash: 'mockHash'
      }, function (error) {
        expect(error);
        done();
      });
    });
  });

  describe('#3 empty path', function () {
    /**
     * 在每个测试之前重置 handler
     */
    beforeEach(function () {
      var plugin = new _QiniuPlugin2.default({
        ACCESS_KEY: 'a',
        SECRET_KEY: 's',
        bucket: 'b',
        path: ''
      });
      var compiler = {
        plugin: function plugin(event, cb) {
          handler = cb;
        }
      };
      plugin.apply(compiler);
    });

    it('without filter', function (done) {
      var qiniu = require('qiniu'); // eslint-disable-line global-require
      qiniu.io.putFile.mockClear();
      handler({
        assets: {
          a: {
            emitted: true,
            existsAt: 'mockExistsAt'
          },
          'index.html': {
            emitted: true,
            existsAt: 'mockExistsAt'
          }
        },
        hash: 'mockHash'
      }, done);
      expect(qiniu.io.putFile).toHaveBeenCalledTimes(2);
      expect(qiniu.io.putFile.mock.calls[0].slice(0, 3)).toEqual(['mockToken', 'a', 'mockExistsAt']);
      expect(qiniu.io.putFile.mock.calls[1].slice(0, 3)).toEqual(['mockToken', 'index.html', 'mockExistsAt']);
    });
  });
});
//# sourceMappingURL=handler.js.map