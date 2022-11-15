export interface ModalButton {
  classNames: string;
  text: string;
  action?: { type: string; payload?: any } | { type: string; payload?: any }[];
}

export interface Modal {
  tabId?: string;
  parameters?: any;
  title: string;
  text: string;
  buttons: ModalButton[];
}

export interface State {
  currentVersion: undefined | string;
  isBeta: boolean;
  versionAwaitingUpdate: undefined | string;
  errors: { errorCode: number; error: string; trace?: string }[];
  modals: Modal[];
  dappModals: {
    [resourceId: string]: Modal[];
  };
  initializationOver: boolean;
  dispatchWhenInitializationOver: any[];
  loadResourceWhenReady: undefined | string;
}
