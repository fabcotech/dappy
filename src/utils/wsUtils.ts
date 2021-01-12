import { MultiCallBody, MultiCallParameters, MultiCallResult, SingleCallParameters } from '../models/WebSocket';
import { BlockchainNode } from '../models';

export const singleCall = (body: { [key: string]: any }, node: BlockchainNode) => {
  return window.singleDappyWsCall(body, node);
};

export const multiCall = (body: MultiCallBody, parameters: MultiCallParameters): Promise<MultiCallResult> => {
  return window.multiDappyWsCall(body, parameters);
};
