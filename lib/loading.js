"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

require("core-js/modules/web.dom.iterable");

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var _default = {
  namespace: 'loading',
  state: {
    loading: false
  },
  reducers: {
    show(state, _ref) {
      let payload = _ref.payload;
      // 传了 key 值， 则使用key作为键值
      const key = payload || 'loading';
      return _objectSpread({}, state, {
        [key]: true
      });
    },

    hide(state, _ref2) {
      let payload = _ref2.payload;
      // 传了 key 值， 则使用key作为键值
      const key = payload || 'loading';
      return _objectSpread({}, state, {
        [key]: false
      });
    }

  }
};
exports.default = _default;