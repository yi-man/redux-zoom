const getModel = (models, actionNameSpace) => {
  const matched = Object.keys(models)
    .filter(key => models[key].namespace === actionNameSpace);

  return matched.length > 0 ? models[matched[0]] : null;
};

const put = (model, namespace, next) => function putReducer(reducer) {
  const { reducers } = model;

  if (reducers[reducer.type]) {
    next({
      type: `${namespace}/${reducer.type}`,
      payload: reducer,
    });
  }
};

const call = dispatch => async (service, params, loading) => {
  dispatch({
    type: 'loading/show',
    payload: loading,
  });

  let res;
  try {
    res = await service(params);
  } catch (e) {
    return Promise.reject(new Error(e));
  } finally {
    dispatch({
      type: 'loading/hide',
      payload: loading,
    });
  }

  return Promise.resolve(res);
};

const createThunkMiddleware = models => store => next => (action) => {
  const { dispatch, getState } = store;
  const [actionNameSpace, actionPiece] = action.type.split('/');
  const model = getModel(models, actionNameSpace);

  if (model) {
    const modelAction = model.action ? model.action[actionPiece] : null;
    if (modelAction) {
      const commit = put(model, actionNameSpace, next);
      const state = getState()[actionNameSpace];

      return modelAction(action, {
        commit, dispatch, state, call: call(dispatch),
      });
    }
    const commit = put(model, actionNameSpace, next);
    return commit({
      ...action,
      type: actionPiece,
    });
  }

  return next(action);
};

export default createThunkMiddleware;
