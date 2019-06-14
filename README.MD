## middleware 注册使用
``` javascript
import {
  createStore,
  applyMiddleware,
  combineReducers,
} from 'redux';
import models from './models';
import ReduxZoom from './middlewares/redux-zoom';

const zoom = new ReduxZoom(models);
const resultReducers = combineReducers(zoom.reducers);
const middlewares = [zoom.createMiddleware()];

createStore(
  resultReducers,
  applyMiddleware(...middlewares)
);
```

参考测试用例的使用，需要根据 models 中的文件创建 zoom 对象，再通过zoom对象创建中间件供 redux使用


## 实际使用
页面中用法
#### 页面中
``` javascript
this.props.dispatch({
  type: 'github/fetchUrl',
  payload: {a: 100}
}).then((d) => {
  console.log('success', d);
}).catch((e) => {
  console.log('catch', e);
});
```
github/fetchUrl： github 是 model 的 namespace， fetchUrl 是 action或reducer 的方法名

#### model 文件结构
``` javascript
export default {
  namespace: 'xxx',  //小驼峰
  state: {},
  action: {},
  reducer: {}
}
```

#### action中
``` javascript
fetchUrl: async ({ type, payload }, { state, commit, dispatch, call }) => {
  // 获取 state
  // const { url } = state;
  // 返回 401
  // const d = await service.getGithubAuthorations(payload);
  // 返回 200
  const d = await service.getGithubInfo(payload);

  // await 在出错时会中断程序后面的执行
  commit({
    type: 'setUrl',
    payload: d
  });
  
  return Promise.resolve(d);
}
```
state: 获取当前state值  
commit：提交变化到当前model的reducer  
dispatch：分发事件到其他任意action  
call: 调用异步请求，自动处理loading， 建议使用call处理异步请求

``` javascript
// call 的例子
// page 中
const mapStateToProps = (state) => {
  // 默认会有个 loading 的model
  const { loading } = state.loading;
  return {
    loading,
  };
};

// action 中
fetchUrl: async ({ type, payload }, { commit, call }) => {
  // call 中做了请求的出错处理， 使得 page能够正确捕捉，并且不需要担心 loading 未取消的情况 
  const d = await call(service.getGithubInfo, payload);

  // await 在出错时会中断程序后面的执行
  commit({
    type: 'setUrl',
    payload: d
  });
  
  return Promise.resolve(d);
}
```

#### 外部使用
``` javascript
import store from '@/store';
store.getState()
store.dispatch()
```
store拥有的接口和之前一致，包括 getState, dispatch

### 命名

- action、reducers建议统一小驼峰命名
