export default {
  namespace: 'app',
  state: {
    name: 'xhh-pc-site'
  },
  action: {
    
  },
  reducers: {    
    modifyName (state, payload) {
      return {
        ...state,
        name: payload
      };
    }
  }
};
