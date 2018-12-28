<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png">
    <HelloWorld msg="Welcome to Your Vue.js App"/>
    <button @click="connect">eos</button>
    <button @click="logoutScatterAsync">fff</button>
  </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from '@/components/HelloWorld.vue'
import ScatterJS from 'scatterjs-core';
import ScatterEOS from 'scatterjs-plugin-eosjs';
import Eos from 'eosjs';


const network =  {
    blockchain : 'eos',
    protocol:'http',
    host:'jungle2.cryptolions.io',
    port: 80,
    chainId:'e70aaab8997e1dfce58fbfac80cbbb8fecec7b99cf982a9444273cbc64c41473'
}

export default {
  name: 'home',
  data: () => ({
    account:null,
  }),
  components: {
    HelloWorld
  },
  methods:{
      connectScatterAsync() {
          return ScatterJS.scatter.connect('testapp', { initTimeout: 2000 });
      },
      async connect() {
          const scatter = ScatterJS.scatter;
          console.log(network);
          scatter.getIdentity({
              accounts:[network]
          }).then(() => {
              const account = scatter.identity.accounts.find(x => x.blockchain === 'eos');
              const eos = scatter.eos(network,Eos,{});
              console.log(account);
          })
          console.log("ok!");
          window.ScatterJS = null;
      },
      logoutScatterAsync() {
          return ScatterJS.scatter.forgetIdentity();
      },
  },
  mounted(){
      this.connectScatterAsync();
  },

  created :function () {
      ScatterJS.plugins( new ScatterEOS() );
      //console.log(('scatter' in window));
      //this.connect();
  },

}
</script>
