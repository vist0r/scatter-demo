<script>
import ScatterJS from 'scatterjs-core';
import ScatterEOS from 'scatterjs-plugin-eosjs';
import Eos from 'eosjs';
import Qs from 'qs';
const axios = require('axios');

const network =  {
    blockchain : 'eos', 
    protocol:'http',
    host:'jungle2.cryptolions.io',
    port: 80,
    chainId:'e70aaab8997e1dfce58fbfac80cbbb8fecec7b99cf982a9444273cbc64c41473'
}
const networkMainNet ={
    blockchain : 'eos',
    protocol:'http',
    host:'api.eosbeijing.one',
    port: 80,
    chainId:'aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906'
}
</script>