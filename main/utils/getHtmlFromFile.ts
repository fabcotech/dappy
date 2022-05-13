import { DappyFile } from "/models";

export const getHtmlFromFile = (dappyFile: DappyFile): any => {
  return atob(dappyFile.data);
};
