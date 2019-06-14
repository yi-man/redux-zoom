"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

require("core-js/modules/es7.symbol.async-iterator");

require("core-js/modules/es6.symbol");

require("core-js/modules/es6.regexp.split");

require("core-js/modules/web.dom.iterable");

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

const getModel = (models, actionNameSpace) => {
  const matched = Object.keys(models).filter(key => models[key].namespace === actionNameSpace);
  return matched.length > 0 ? models[matched[0]] : null;
};

const put = (model, namespace, next) => function putReducer(reducer) {
  const reducers = model.reducers;

  if (reducers[reducer.type]) {
    next({
      type: `${namespace}/${reducer.type}`,
      payload: reducer
    });
  }
};

const call = dispatch => async (service, params, loading) => {
  dispatch({
    type: 'loading/show',
    payload: loading
  });
  let res;

  try {
    res = await service(params);
  } catch (e) {
    return Promise.reject(new Error(e));
  } finally {
    dispatch({
      type: 'loading/hide',
      payload: loading
    });
  }

  return Promise.resolve(res);
};

const createThunkMiddleware = models => store => next => action => {
  const dispatch = store.dispatch,
        getState = store.getState;

  const _action$type$split = action.type.split('/'),
        _action$type$split2 = _slicedToArray(_action$type$split, 2),
        actionNameSpace = _action$type$split2[0],
        actionPiece = _action$type$split2[1];

  const model = getModel(models, actionNameSpace);

  if (model) {
    const modelAction = model.action ? model.action[actionPiece] : null;

    if (modelAction) {
      const commit = put(model, actionNameSpace, next);
      const state = getState()[actionNameSpace];
      return modelAction(action, {
        commit,
        dispatch,
        state,
        call: call(dispatch)
      });
    }

    const commit = put(model, actionNameSpace, next);
    return commit(_objectSpread({}, action, {
      type: actionPiece
    }));
  }

  return next(action);
};

var _default = createThunkMiddleware;
exports.default = _default;