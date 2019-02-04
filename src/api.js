import ScatterJS from 'scatterjs-core';
import ScatterEOS from 'scatterjs-plugin-eosjs';
import Eos from 'eosjs';
ScatterJS.plugins(new ScatterEOS());
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
const eos = () => ScatterJS.scatter.eos(network, Eos, { expireInSeconds: 60 });
const currentEOSAccount = () => ScatterJS.scatter.identity && ScatterJS.scatter.identity.accounts.find(x => x.blockchain === 'eos');
const API = {
      connectScatterAsync() {
        return ScatterJS.scatter.connect('CreateAccount', { initTimeout: 2000 });
      },
      loginScatterAsync() {
        const requiredFields = { accounts: [network] };
        return ScatterJS.scatter.getIdentity(requiredFields);
      },
      logoutScatterAsync() {
        return ScatterJS.scatter.forgetIdentity();
      },
      async getbetsTable(account){
        const { rows } = await eos().getTableRows({
            json: true,
            code: 'dicediceshz1',
            scope: account,
            table: 'results',
            limit: 1024,
          });
          return rows;
      },
      transferEOSAsync({
        to,
        memo = '',
        amount = '0 EOS',
      }) {
        return eos().transfer(
          currentEOSAccount().name,
          to,
          amount,
          memo, {
            authorization: [`${currentEOSAccount().name}@${currentEOSAccount().authority}`],
          },
        );
      },
}
export default API;
export { eos, currentEOSAccount };