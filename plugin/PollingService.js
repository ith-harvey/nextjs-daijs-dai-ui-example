import { PublicService } from '@makerdao/services-core';
import padStart from 'lodash/padStart';
import padEnd from 'lodash/padEnd';
import ethAbi from 'web3-eth-abi';

const funcSigTopic = v => padEnd(ethAbi.encodeFunctionSignature(v), 66, '0');
const EVENT_START = funcSigTopic('createPoll(uint256,uint256,string,string)');

console.log("event_start", EVENT_START)

export default class PollingService extends PublicService {
  constructor(name = 'polling') {
    super(name, ['web3', 'smartContract']);
  }

  /**Event History */
  async getPollCreatedEvents() {
   const web3 = this.get('web3');
       const logs = await web3.getPastLogs({
         address: this._polling.address,
         topics: [
           EVENT_START
         ],
         fromBlock: '8600000',
       });

        console.log("here", logs)
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
