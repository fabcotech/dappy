import { MultiCallBody, MultiCallParameters, MultiCallResult } from '../models/WebSocket';
import { BlockchainNode } from '../models';

export const singleCall = (body: { [key: string]: any }, node: BlockchainNode) => {
  return window.singleDappyCall(body, node);
};

export const multiCall = (body: MultiCallBody, parameters: MultiCallParameters): Promise<MultiCallResult> => {
  return window.multiDappyCall(body, parameters);
};
