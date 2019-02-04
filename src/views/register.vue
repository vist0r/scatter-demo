<template>
  <div>
    <div id="nav">
      <span>Create an EOSIO account</span>
    </div>
    <template>
        <div style="margin: 20px;"></div>
        <el-form label-position="left" label-width="150px" :model="formLabelAlign">
        <el-form-item label="AccountName">
            <el-input v-model="inputuid"></el-input>
        </el-form-item>
        <el-form-item label="ActiveKey">
            <el-input v-model="inputactiveKey"></el-input>
        </el-form-item>
        <el-form-item label="OwnerKey">
            <el-input v-model="inputownerKey"></el-input>
        </el-form-item>
        <el-form-item label="Invite account">
            <el-input v-model="cardname"></el-input>
        </el-form-item>
        <el-form-item label="Invite  password">
            <el-input v-model="cardkey"></el-input>
        </el-form-item>
        <el-form-item style="padding-right:135px">
            <el-button type="primary" @click="send">Send</el-button>
        </el-form-item>
        </el-form>
    </template>
   <div>
        <h3>EOSIO account naming rules:</h3>

        <h4>&nbsp;&nbsp;&nbsp; 1.Less than 13 characters;</h4>

        <h4>&nbsp;&nbsp;&nbsp; 2.Contains only these characters: .12345abcdefghijklmnopqrstuvwxyz</h4>

        <h3>How to get scatter:</h3>

        <h4>&nbsp;&nbsp;&nbsp; <a href="https://zhuanlan.zhihu.com/p/40250746" target="blank">https://zhuanlan.zhihu.com/p/40250746</a></h4>

        <h3>Generate a public and private key pair:</h3>

        <h4>&nbsp;&nbsp;&nbsp; <a href="https://eos-key.mytokenpocket.vip/" target="blank">https://eos-key.mytokenpocket.vip/</a></h4>

        <h3>How to get Invite account &amp;&amp; Invite password:</h3>

        <h4>&nbsp;&nbsp;&nbsp; contact me!</h4>
    </div>
  </div>
</template>
<script>
// @ is an alias to /src

import Qs from 'qs';
const axios = require('axios');


export default {
  name: 'register',
  data: () => ({
    inputuid:'',
    inputactiveKey:'',
    inputownerKey:'',
    cardname:'',
    cardkey:'',
  }),
  methods:{
      send(){
            var data = Qs.stringify({
                    uid:this.inputuid,
                    activekey:this.inputactiveKey,
                    ownerkey:this.inputownerKey,
                    cardname:this.cardname,
                    cardkey:this.cardkey
            });
            axios({
                url:'/api/register',
                method:'post',
                headers : {
                    "Content-Type":'application/x-www-form-urlencoded; charset=UTF-8'
                },
                data
            }).then(res=>{
                if (res.status != 200){
                    alert(res.statusText);
                }else {
                    data = res.data;
                    if (data.status == 200){
                        alert("Create Success! The transaction_id = " + data.transaction_id)
                    }else{
                        alert("Create Failed! error:" + data.error)
                    }
                }
            })
            
      } ,
      transfer(){
          const transactionOption = {authorization:[`${this.account.name}@${this.account.authority}`]};
          this.eos.transfer(this.account.name,'shzshzshzshz','0.0010 EOS','transfer for test',transactionOption).then(trx=>{
              console.log(`Transaction ID: ${trx.transaction_id}`);
          }).catch(error=>{
              console.log(error);
          })
      },
      createAccount(){
        this.eos.transaction(
        {
            actions: [
            {
                account: 'ccnuccnuccnu',
                name: 'crt',
                authorization: [{
                    actor: this.account.name,
                    permission: 'active'
                }],
                data: {
                    newact: this.inputuid,
                    owner: this.inputownerKey,
                    active: this.inputactiveKey
                }
            }
        ]
        },
        { 
            broadcast: true, 
            sign: true 
        }).then(res => {
            console.log(res);
        }).catch(err => {
            console.log(err);
        })
       }
  },
}
</script>
<style>
#nav {
    padding: 30px;
    font-weight: bold;
    color: #2c3e50;
}
</style>
