<template>
  <div class="dice">
    <h1>Dice game</h1>
    <el-container  element-loading-text="Waiting to reveal"  v-loading="pending">
      <div class="box">
			<div class="first face" v-bind:class="{isDisplay:isDisplay_1}">
				<span class="pip"></span>
			</div>
			<div class="second face" v-bind:class="{isDisplay:isDisplay_2}">
				<span class="pip"></span>
				<span class="pip"></span>
			</div>
			<div class="third face" v-bind:class="{isDisplay:isDisplay_3}">
				<span class="pip"></span>
				<span class="pip"></span>
				<span class="pip"></span>
			</div>
			<div class="fourth face" v-bind:class="{isDisplay:isDisplay_4}">
				<div class="column">
					<span class="pip"></span>
					<span class="pip"></span>
				</div>
				<div class="column">
					<span class="pip"></span>
					<span class="pip"></span>
				</div>
			</div>
			<div class="fifth face" v-bind:class="{isDisplay:isDisplay_5}">
				<div class="column">
					<span class="pip"></span>
					<span class="pip"></span>
				</div>
				<div class="column">
					<span class="pip"></span>
				</div>
				<div class="column">
					<span class="pip"></span>
					<span class="pip"></span>
				</div>
			</div>
			<div class="sixth face" v-bind:class="{isDisplay:isDisplay_6}">
				<div class="column">
					<span class="pip"></span>
					<span class="pip"></span>
					<span class="pip"></span>
				</div>
				<div class="column">
				
				</div>
				<div class="column">
					<span class="pip"></span>
					<span class="pip"></span>
					<span class="pip"></span>
				</div>
			</div>
      </div>
      </el-container>
      <el-radio-group v-model="gametype" style="padding-top: 25px">
        <el-radio label="1:1" border></el-radio>
        <el-radio  label="1:6" border></el-radio>
      </el-radio-group>
      <div style="margin-top: 20px" v-if="gametype === '1:1'">
        <el-radio-group v-model="Type">
          <el-radio  label="1,2,3 WIN" border></el-radio>
          <el-radio  label="4,5,6 WIN" border></el-radio>
        </el-radio-group>
      </div>
      <div style="margin-top: 20px" v-if="gametype === '1:6'">
        <el-radio-group v-model="Type">
          <el-radio  label="1" border></el-radio>
          <el-radio  label="2" border></el-radio>
          <el-radio  label="3" border></el-radio>
          <el-radio  label="4" border></el-radio>
          <el-radio  label="5" border></el-radio>
          <el-radio  label="6" border></el-radio>
        </el-radio-group>
      </div>
      <div style="margin-top: 20px">
        <el-radio-group v-model="betsamout" @change="changechips($event)">
          <el-radio  label="0.1 EOS" border></el-radio>
          <el-radio  label="1 EOS" border></el-radio>
          <el-radio  label="10 EOS" border></el-radio>
          <el-radio  label="100 EOS" border></el-radio>
          <el-radio  label="Custom" border></el-radio>
        </el-radio-group>
      </div>
      <div class="nav" style="margin-top:20px"  v-if="betsamout == 'Custom'">
        <span>Custom amount: </span>
        <input v-model="tmpchip"> EOS</input>
      </div>
      <div style="margin-top:20px"> 
        <el-button type="success" @click="confirm()"  v-if="is_ok()" round>Confirm !</el-button>
        <el-button type="success" @click="confirm()"  v-if="!is_ok()" round disabled>Confirm !</el-button>
      </div>
  </div>
</template>
<script>
  import { mapActions, mapState } from 'vuex';
  import API from '../api';
  export default {
    name:'dice',
    data: () => ({
          isDisplay_1: true,
					isDisplay_2: true,
					isDisplay_3: false,
					isDisplay_4: true,
					isDisplay_5: true,
          isDisplay_6: true,
          tmpchip:null,
          gametype:'',
          chip:'',
          Type:'',
          betsamout:'',
          vaildchip:'',
          interval:null,
          timeout:null,
          pending:false,
    }),
    methods:{
      ...mapActions(['getBetsTable']),
      toDecimal(x) {
          var f = parseFloat(x);
          if (isNaN(f)) {
              return false;
          }
          var f = Math.round(x * 100) / 100;
          var s = f.toString();
          var rs = s.indexOf('.');
          if (rs < 0) {
              rs = s.length;
              s += '.';
          }
          while (s.length <= rs + 4) {
              s += '0';
          }
          return s;
      },
      isValidInput: function (value) {
        if (value != null) {
            if (! /^\d*(?:\.\d{0,4})?$/.test(value)) {
                return false;
            }
        }
        return true;
      },
      changechips: function (event) {
        if (this.betsamout === 'Custom') {
          this.chip = null;
          return;
        }
        var amount = this.betsamout.split(' ');
        this.chip = amount[0];
      },
      is_ok(){
        return (this.gametype != '') && (this.Type != '') && (this.chip != '') && !this.pending;
      },
      getmemo(){
        if (this.gametype === '1:6'){
           return 'SINGLE ' + this.Type;
        }
        if (this.Type === "1,2,3 WIN"){
          return 'HALF SMALL';
        }
        return 'HALF BIG';
      },
      async confirm(){
        try{
          var res = await API.transferEOSAsync({
            from:this.account.name,
            to:'dicediceshz1',
            amount: this.toDecimal(this.chip) + ' EOS',
            memo:this.getmemo()
          });
          console.log(res);
          const h = this.$createElement;

          this.$notify({
              title: 'Successful transaction!',
              message: h('i', { style: 'color: teal'}, res.transaction_id),
              type:'success'
          });
          if (this.$route.path == '/'){
          this.pending = true;
          this.timeout = setTimeout(()=>{
              this.getBetsTable(this.account.name).then(()=>{
                  this.pending = false;
									this.showPoint(this.bets.roll);
									var stat = this.bets.status;
									  this.$notify({
												title: 'id: ' + this.bets.id + '; ' + stat,
												message: stat === 'WIN' ? `The ${this.bets.roll} is a Lucky points!` : `Sorry, The point is ${this.bets.roll} Thank you for your patronage`,
												duration: 0
        						});
              });
          },3000)
        }else{
          this.timeout = null;
        }
      } catch(error){
        this.$notify.error({
          title: 'error',
          message: error.message
        });
      }
      },
      showPoint: function(roll) {
            var flag = parseInt(roll) - 1; 
						switch (flag) {
							case 0:
								this.reset();
								this.isDisplay_1 = !this.isDisplay_1;
								break;
							case 1:
								this.reset();
								this.isDisplay_2 = !this.isDisplay_2;
								break;
							case 2:
								this.reset();
								this.isDisplay_3 = !this.isDisplay_3;
								break;
							case 3:
								this.reset();
								this.isDisplay_4 = !this.isDisplay_4;
								break;
							case 4:
								this.reset();
								this.isDisplay_5 = !this.isDisplay_5;
								break;
							case 5:
								this.reset();
								this.isDisplay_6 = !this.isDisplay_6;
								break;
						}
					},
					reset: function(){
						this.isDisplay_1 = true,
						this.isDisplay_2 = true,
						this.isDisplay_3 = true,
						this.isDisplay_4 = true,
						this.isDisplay_5 = true,
						this.isDisplay_6 = true
					},
					randomNum: function(){
						return Math.round(Math.random()*5);
					}
    },
    computed:{
      ...mapState(['bets','account']),
    },
    watch:{
      'tmpchip':function(val){
         if (!this.isValidInput(val)){
           this.chip = this.vaildchip;
           this.tmpchip = this.vaildchip;
         }
         this.chip = val;
         this.vaildchip = val;
         console.log("this.chip = " + this.chip);
      },
    },
    created(){
        if (this.timeout){
          clearTimeout(this.timeout);
        }
    }
  }
</script>
<style type="text/css">
		.box {
			width: 100%;
			display: flex;
			justify-content: center;
		}
 
		.pip {
			display: block;
			width: 24px;
			height: 24px;
			border-radius: 50%;
			margin: 4px;
 
			background-color: #333;
			box-shadow: inset 0 3px #111, inset 0 -3px #555;
		}
 
		.face {
			margin: 16px;
			padding: 4px;
 
			background-color: #e7e7e7;
			width: 104px;
			height: 104px;
			object-fit: contain;
 
			box-shadow:
				inset 0 5px white,
				inset 0 -5px #bbb,
				inset 5px 0 #d7d7d7,
				inset -5px 0 #d7d7d7;
 
			border-radius: 10%;
		}
 
		.first {
			display: flex;
			align-items: center;
			justify-content: center;
		}
 
		.second {
			display: flex;
			justify-content: space-between;
		}
 
		.second .pip:nth-of-type(2) {
			align-self: flex-end;
		}
 
		.third {
			display: flex;
			justify-content: space-between;
		}
 
		.third .pip:nth-of-type(2) {
			align-self: center;
		}
 
		.third .pip:nth-of-type(3) {
			align-self: flex-end;
		}
 
		.fourth {
			display: flex;
			flex-wrap: wrap;
			justify-content: space-between;
		}
 
		.fourth .column,
		.sixth .column {
			display: flex;
			flex-direction: column;
			justify-content: space-between;
		}
 
		.fifth {
			display: flex;
			justify-content: space-between;
		}
 
		.fifth .column {
			display: flex;
			flex-direction: column;
			justify-content: space-between;
		}
 
		.fifth .column:nth-of-type(2) {
			display: flex;
			justify-content: center;
		}
 
		.sixth {
			display: flex;
			justify-content: space-between;
		}
 
		.isDisplay {
			display: none;
		}
    .nav {
    font-weight: bold;
    color: #2c3e50;
   }
</style>