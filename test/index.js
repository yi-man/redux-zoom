import chai from 'chai';
import {
  createStore,
  applyMiddleware,
  combineReducers,
  compose,
} from 'redux';

import ReduxZoom from '../src/index';
import models from './models'

describe('zoom middleware', () => {
  const doNext = () => {}

  const zoom = new ReduxZoom(models);
  const { reducers } = zoom;
  const resultReducers = combineReducers(zoom.reducers);

  const middleware = zoom.createMiddleware();

  const store = createStore(
    resultReducers,
    applyMiddleware(middleware),
  );

  const nextHandler = middleware(store)

  it('zoom must be a obj', () => {
    chai.assert.isObject(zoom);
  });

  it('reducer must has [app, github, loading] keys, and they [app, github, loading] are functions', () => {
    chai.assert.hasAllKeys(reducers, ['app', 'github', 'loading'])
    
    Object.keys(reducers).forEach((key) => {
      chai.assert.isFunction(reducers[key])
    })
  });

  it('must return a function to handle next', () => {
    chai.assert.isFunction(nextHandler);
    chai.assert.strictEqual(nextHandler.length, 1);
  });

  describe('handle next', () => {
    const actionHandler = nextHandler(doNext);

    it('must return a function to handle action', () => {
      chai.assert.isFunction(actionHandler);
      chai.assert.strictEqual(actionHandler.length, 1);
    });

    describe('handle action', () => {

      it('can get state in action', done => {
        const state = actionHandler({
          type: 'github/getUrl'
        })

        chai.assert.strictEqual(state.url.baidu, 'http://www.baidu.com')
        done()
      })

      it('must get async correct result', done => {
        actionHandler({
          type: 'github/fetchUrlSuccess'
        }).then((d) => {
          chai.assert.strictEqual(d.user_repositories_url, 'https://api.github.com/users/{user}/repos{?type,page,per_page,sort}')          
          done();
        })        
      });  

      it('use call function get right result', done => {
        actionHandler({
          type: 'github/useCall'
        }).then((d) => {
          chai.assert.strictEqual(d.user_repositories_url, 'https://api.github.com/users/{user}/repos{?type,page,per_page,sort}')          
          done();
        })        
      });

    })   
  });


});
