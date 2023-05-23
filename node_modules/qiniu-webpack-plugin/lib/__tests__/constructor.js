'use strict';

var _QiniuPlugin = require('../QiniuPlugin');

var _QiniuPlugin2 = _interopRequireDefault(_QiniuPlugin);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe('QiniuPlugin', function () {
  describe('constructor', function () {
    it('will throw if no parameter is provided', function () {
      expect(function () {
        new _QiniuPlugin2.default(); // eslint-disable-line no-new
      }).toThrow();
    });

    it('will set qiniu global options', function () {
      var qiniu = require('qiniu'); // eslint-disable-line global-require
      new _QiniuPlugin2.default({ ACCESS_KEY: 'a', SECRET_KEY: 's' }); // eslint-disable-line no-new
      expect(qiniu.conf).toEqual({ ACCESS_KEY: 'a', SECRET_KEY: 's' });
    });
  });

  it('will call plugin method when applied', function () {
    var plugin = new _QiniuPlugin2.default({ ACCESS_KEY: 'a', SECRET_KEY: 's' });
    var compiler = {
      plugin: jest.fn()
    };
    plugin.apply(compiler); // webpack will do this
    expect(compiler.plugin).toBeCalled();
    expect(compiler.plugin.mock.calls[0][0]).toEqual('after-emit');
  });
});
//# sourceMappingURL=constructor.js.map