import { ResolverMode } from '../models';
import { MultiCallBody, MultiCallParameters, MultiCallResult, SingleCallParameters } from '../models/WebSocket';

export const singleCall = (body: { [key: string]: any }, parameters: SingleCallParameters) => {
  return window.singleDappyWsCall(body, parameters);
};

export const multiCall = (body: MultiCallBody, parameters: MultiCallParameters): Promise<MultiCallResult> => {
  return window.multiDappyWsCall(body, parameters);
};
