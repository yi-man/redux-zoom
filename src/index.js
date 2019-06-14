import invariant from 'invariant';
import thunk from './thunk';
import loading from './loading';

const getReducers = (namespace, defaultState, reducers) => {
  const actionTypes = Object.keys(reducers);

  return (state, action) => {
    const newState = state || defaultState;
    const [actionNameSpace, actionPiece] = action.type.split('/');

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
    models.push(loading);
    models.forEach((model) => {
      const { namespace } = model;

      // namespace 必须被定义
      invariant(
        namespace,
        '[app.model] namespace should be defined',
      );
      // 并且是字符串
      invariant(
        typeof namespace === 'string',
        `[app.model] namespace should be string, but got ${typeof namespace}`,
      );

      if (process.env.NODE_ENV === 'development') {
        const exists = models.filter(mod => mod.namespace === namespace);
        // 并且唯一
        invariant(
          exists.length === 1,
          '[app.model] namespace should be unique',
        );
      }

      this.registerModel(model);

      this.reducers[model.namespace] = getReducers(model.namespace, model.state, model.reducers);
    });
  }

  createMiddleware() {
    return thunk(this.models);
  }
}

export default Zoom;
