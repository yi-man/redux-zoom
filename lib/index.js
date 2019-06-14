"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

require("core-js/modules/es7.symbol.async-iterator");

require("core-js/modules/es6.symbol");

require("core-js/modules/es6.regexp.split");

require("core-js/modules/web.dom.iterable");

var _invariant = _interopRequireDefault(require("invariant"));

var _thunk = _interopRequireDefault(require("./thunk"));

var _loading = _interopRequireDefault(require("./loading"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

const getReducers = (namespace, defaultState, reducers) => {
  const actionTypes = Object.keys(reducers);
  return (state, action) => {
    const newState = state || defaultState;

    const _action$type$split = action.type.split('/'),
          _action$type$split2 = _slicedToArray(_action$type$split, 2),
          actionNameSpace = _action$type$split2[0],
          actionPiece = _action$type$split2[1];

    if (actionNameSpace !== namespace) return newState;

    if (actionTypes.indexOf(actionPiece) !== -1) {
      return reducers[actionPiece](newState, action.payload);
    }

    return newState;
  };
};

class Zoom {
  constructor(models) {
    this.models = [];
    this.reducers = {};
    this.transformModels(models);
  }

  registerModel(model) {
    if (!this.models[model.namespace]) {
      this.models[model.namespace] = model;
    }
  }

  transformModels(models) {
    models.push(_loading.default);
    models.forEach(model => {
      const namespace = model.namespace; // namespace 必须被定义

      (0, _invariant.default)(namespace, '[app.model] namespace should be defined'); // 并且是字符串

      (0, _invariant.default)(typeof namespace === 'string', `[app.model] namespace should be string, but got ${typeof namespace}`);

      if (process.env.NODE_ENV === 'development') {
        const exists = models.filter(mod => mod.namespace === namespace); // 并且唯一

        (0, _invariant.default)(exists.length === 1, '[app.model] namespace should be unique');
      }

      this.registerModel(model);
      this.reducers[model.namespace] = getReducers(model.namespace, model.state, model.reducers);
    });
  }

  createMiddleware() {
    return (0, _thunk.default)(this.models);
  }

}

var _default = Zoom;
exports.default = _default;