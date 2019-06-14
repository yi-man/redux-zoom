import service from './service';

export default {
  namespace: 'github',
  state: {
    url: {
      baidu: 'http://www.baidu.com'
    }
  },
  action: {
    getUrl: (payload, { state }) => {
      return state
    },
    fetchUrlSuccess: async (payload, { state, commit, dispatch }) => {
      const { url } = state;

      let d;
      try {
        d = await service.getGithubInfo(payload);
      } catch(err) {
        console.log(err);
      }
    
      if (d) {
        commit({
          type: 'setUrl',
          payload: d
        });
        return d
      }
      
      return Promise.reject(100);
    },
    useCall: async (payload, { commit, call }) => {
      let d = await call(service.getGithubInfo, payload)
      
      commit({
        type: 'setUrl',
        payload: d
      });

      return d
    }
  },
  reducers: {   
    setUrl (state, payload) {
      const { url } = state;
      return {
        ...state,
        url: {
          ...url,
          ...payload
        }
      };
    }
  }
};