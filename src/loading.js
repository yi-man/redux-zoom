export default {
  namespace: 'loading',
  state: {
    loading: false,
  },
  reducers: {
    show(state, { payload }) {
      // 传了 key 值， 则使用key作为键值
      const key = payload || 'loading';
      return {
        ...state,
        [key]: true,
      };
    },
    hide(state, { payload }) {
      // 传了 key 值， 则使用key作为键值
      const key = payload || 'loading';
      return {
        ...state,
        [key]: false,
      };
    },
  },
};
