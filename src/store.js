import Vue from 'vue'
import Vuex from 'vuex'
import API,{currentEOSAccount} from './api'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
      account:null,
      isScatterConnected:false,
      bets:null,
  },
  mutations: {
    setEosAccount(state,account){
        state.account = account;
    },
    setIsScatterConnected(state, isScatterConnected) {
      state.isScatterConnected = isScatterConnected;
    },
    setbetsList(state,betsList){
      state.bets = betsList;
    }
  },
  actions: {
    async connectScatterAsync({ commit }){
      console.log('Connecting to Scatter desktop...');
      const connected = await API.connectScatterAsync();
      if (connected){
        commit('setIsScatterConnected', true);
        if (currentEOSAccount()){
          commit('setEosAccount', currentEOSAccount());
        }
      }
    },
    async loginScatterAsync({ commit }) {
      try {
        const identity = await API.loginScatterAsync();
        if (!identity) {
          return;
        }
        const account = identity.accounts.find(({ blockchain }) => blockchain === 'eos');
        commit('setEosAccount',account);
      } catch (err) {
        console.error('Failed to login Scatter', err);
      }
    },
    async logoutScatterAsync({ commit }) {
      try {
        await API.logoutScatterAsync();
      } catch (err) {
        console.error('Failed to logout Scatter', err);
      }
      commit('setEosAccount', null);
    },
    async getBetsTable({ commit ,state}) {
      try {
        const betsInfoList = await API.getbetsTable(state.account.name);
        if (betsInfoList[0] == null) {
          console.log('There is null');
        } else {
          commit('setbetsList', betsInfoList[0]);
        }
      } catch (err) {
        console.error('Failed to fetch betsListResults', err);
      }
    },
  }
})
