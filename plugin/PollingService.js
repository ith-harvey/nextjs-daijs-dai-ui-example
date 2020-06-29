import { PublicService } from '@makerdao/services-core';
import padStart from 'lodash/padStart';
import padEnd from 'lodash/padEnd';
import ethAbi from 'web3-eth-abi';
import fetch from 'isomorphic-fetch';

const funcSigTopic = v => padEnd(ethAbi.encodeFunctionSignature(v), 66, '0');
const EVENT_START = funcSigTopic('createPoll(uint256,uint256,string,string)');

console.log("event_start", EVENT_START)

export default class PollingService extends PublicService {
  constructor(name = 'polling') {
    super(name, ['web3', 'smartContract']);
  }


  //async getGithubData(url) {
  //  // Default options are marked with *
  //  console.log('url', url)
  //  const response = await fetch(url, {
  //    method: 'GET', // *GET, POST, PUT, DELETE, etc.
  //    headers: {
  //      'Content-Type': 'application/json'
  //    },
  //  });
  //  console.log('response', response)
  //  return response.json(); // parses JSON response into native JavaScript objects
  //}


  //formatData() {
  //}


  /**Event History */
  async getPollCreatedEvents() {
   const contract = this._polling()
   const pollingContract = this.get('web3').web3Contract(contract.wrappedContract.interface.abi, contract.address)
   const logs = await pollingContract.getPastEvents('PollCreated',{fromBlock: 0})
  // const finalizedEvent = logs.map(async log => {
   // console.log("here", await this.getGithubData(log.returnValues.url))
    //return log
  // })

   return logs;
   }

  /**Polling Methods */
   vote(pollId, optionId) {
        this._polling().vote(pollId, optionId);
   }

  _polling() {
    return this.get('smartContract').getContractByName('POLLING');
  }

}
