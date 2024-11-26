// store.js
import { createStore } from 'vuex';
import VueCookies from 'vue-cookies';

const store = createStore({
  state: {
    user: {
      id: VueCookies.get('userId') || null,
      name: VueCookies.get('userName') || '',
      token: VueCookies.get('userToken') || '',
    },
  },
  mutations: {
    setUser(state, user) {
      state.user.id = user.id;
      state.user.name = user.name;
      state.user.token = user.token;
      VueCookies.set('userId', user.id);
      VueCookies.set('userName', user.name);
      VueCookies.set('userToken', user.token);
    },
    clearUser(state) {
      state.user.id = null;
      state.user.name = '';
      state.user.token = '';
      VueCookies.remove('userId');
      VueCookies.remove('userName');
      VueCookies.remove('userToken');
    },
  },
  actions: {
    login({ commit }, userData) {
      commit('setUser', userData);
    },
    logout({ commit }) {
      commit('clearUser');
    },
  },
  getters: {
    isAuthenticated: (state) => !!state.user.token,
    getUser: (state) => state.user,
    getUserId(state) { return state.user.id; }
  },
});

export default store;
