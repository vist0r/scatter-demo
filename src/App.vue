<template>
  <div id="app">
    <div class="line"></div>
    <template>
      <el-menu
        :default-active="activeIndex2"
        class="el-menu-demo"
        mode="horizontal"
        @select="handleSelect"
        background-color="#545c64"
        text-color="#fff"
        active-text-color="#ffd04b">
        <el-menu-item index="1" @click="jump_dice">
          Dice
        </el-menu-item>
        <el-menu-item index="2" @click="jump_register">
          Register
        </el-menu-item>
        <div style="float: right;" class="el-menu--horizontal">
            <el-menu-item index="3" @click="loginScatterAsync" v-if="account === null && isScatterConnected === true">
              Login
            </el-menu-item>
            <el-menu-item index="4" v-if="account != null">
              Welcome, {{account.name}} !
            </el-menu-item>
            <el-menu-item index="5" @click="logoutScatterAsync" v-if="account != null">
              Logout
            </el-menu-item>
        </div>  
      </el-menu>
    </template>
    <router-view/>
  </div>
</template>

<style lang="scss">
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  a{
        text-decoration: none;
  }
}
</style>
<script>
import { mapActions, mapState } from 'vuex';
export default {
  name:'app',
  methods:{
    ...mapActions(['connectScatterAsync','loginScatterAsync','logoutScatterAsync']),
    jump_dice(){
      this.$router.push({path: '/'});
    },

    jump_register(){
      this.$router.push({path: '/register'});
    }
  },
  computed:{
    ...mapState(['account','isScatterConnected'])
  },
  mounted(){
    this.connectScatterAsync().then( ()=>{
    if (this.isScatterConnected === false){
          this.$alert('No scatter desktop or scatter plugin found, please visit scatter official website: https://get-scatter.com/',
           'No scatter desktop or scatter plugin found', {
          confirmButtonText: 'Ok',
          callback: action => {
            this.$message({
              type: 'info',
              message: `error: No scatter desktop or scatter plugin found!`
            });
          }
        });
    }
    });
  },

}
</script>
