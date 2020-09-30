import {
  DappManifest,
  LoadCompleted,
  LoadErrors,
  Tab,
  LoadErrorWithArgs,
  Identification,
  LoadedFile,
  IpApp,
  TransitoryState,
} from '../../models';

export const UPDATE_TABS_FROM_STORAGE = '[Dapps] Update tabs from storage';

export const UPDATE_SEARCH = '[Dapps] Update search';
export const CLEAR_SEARCH_AND_LOAD_ERROR = '[Dapps] Clear search and load error';
export const LOAD_RESOURCE = '[Dapps] Load resource';
export const RELOAD_RESOURCE = '[Dapps] Reload resource';
export const INIT_TRANSITORY_STATE_AND_RESET_LOAD_ERROR = '[Dapps] Init transitory state and reset load error';
export const UPDATE_LOAD_STATE = '[Dapps] Update load state';
export const LOAD_RESOURCE_FAILED = '[Dapps] Load resource failed';
export const RELOAD_RESOURCE_FAILED = '[Dapps] Reload resource failed';
export const RELOAD_DAPP_COMPLETED = '[Dapps] Reload dapp completed';

export const FOCUS_SEARCH_DAPP = '[Dapps] Focus search dapp';

export const FOCUS_TAB = '[Dapps] Focus tab';
export const FOCUS_AND_ACTIVATE_TAB = '[Dapps] Focus and activate tab';
export const CREATE_TAB = '[Dapps] Create tab';
export const UPDATE_TAB_SEARCH = '[Dapps] Update tab search';
export const LAUNCH_DAPP_COMPLETED = '[Dapps] Launch dapp completed';
export const LAUNCH_FILE_COMPLETED = '[Dapps] Launch file completed';
export const RELOAD_FILE_COMPLETED = '[Dapps] Reload file completed';
export const LAUNCH_IP_APP_COMPLETED = '[Dapps] Launch IP app completed';
export const UPDATE_TRANSITORY_STATE = '[Dapps] Update transitory state';
export const REMOVE_TAB = '[Dapps] Remove tab';
export const REMOVE_TAB_COMPLETED = '[Dapps] Remove tab completed';
export const STOP_TAB = '[Dapps] Stop tab';
export const SET_TAB_MUTED = '[Dapps] Set tab muted';

export const SAVE_IDENTIFICATION = '[Dapps] Save identification';

export interface UpdatTabsFromStoragePayload {
  tabs: Tab[];
}
export const updatTabsFromStorageAction = (values: UpdatTabsFromStoragePayload) => ({
  type: UPDATE_TABS_FROM_STORAGE,
  payload: values,
});

export const updateSearchAction = (search: string) => ({
  type: UPDATE_SEARCH,
  payload: search,
});

export interface ClearSearchAndLoadErrorPayload {
  tabId: string;
  clearSearch: boolean;
}
export const clearSearchAndLoadErrorAction = (values: ClearSearchAndLoadErrorPayload) => ({
  type: CLEAR_SEARCH_AND_LOAD_ERROR,
  payload: values,
});

export interface InitTransitoryStateAndResetLoadErrorPayload {
  tabId: string;
  resourceId: string;
}
export const initTransitoryStateAndResetLoadErrorAction = (payload: InitTransitoryStateAndResetLoadErrorPayload) => ({
  type: INIT_TRANSITORY_STATE_AND_RESET_LOAD_ERROR,
  payload: payload,
});

export interface LoadResourcePayload {
  address: string;
  tabId?: string;
  url?: string; // used only for IP apps
}
export const loadResourceAction = (payload: LoadResourcePayload) => ({
  type: LOAD_RESOURCE,
  payload: payload,
});

export interface ReloadResourcePayload {
  tabId: string;
}
export const reloadResourceAction = (payload: ReloadResourcePayload) => ({
  type: RELOAD_RESOURCE,
  payload: payload,
});

export interface UpdateLoadStatePayload {
  resourceId: string;
  loadState: { completed: LoadCompleted; errors: LoadErrors; pending: string[] };
}
export const updateLoadStateAction = (values: UpdateLoadStatePayload) => ({
  type: UPDATE_LOAD_STATE,
  payload: values,
});

export interface ReloadDappCompletedPayload {
  dappManifest: DappManifest;
}
export const reloadDappCompletedAction = (values: ReloadDappCompletedPayload) => ({
  type: RELOAD_DAPP_COMPLETED,
  payload: values,
});

export interface LoadResourceFailedPayload {
  search: string;
  tabId: string;
  error: LoadErrorWithArgs;
}
export const loadResourceFailedAction = (values: LoadResourceFailedPayload) => ({
  type: LOAD_RESOURCE_FAILED,
  payload: values,
});
export const reloadResourceFailedAction = (values: LoadResourceFailedPayload) => ({
  type: RELOAD_RESOURCE_FAILED,
  payload: values,
});

export const focusSearchDappAction = () => ({
  type: FOCUS_SEARCH_DAPP,
});

export interface FocusTabPayload {
  tabId: string;
}
export const focusTabAction = (values: FocusTabPayload) => ({
  type: FOCUS_TAB,
  payload: values,
});

export interface FocusAndActivateTabPayload {
  tabId: string;
  resourceId: string;
  address: string;
}
export const focusAndActivateTabAction = (values: FocusAndActivateTabPayload) => ({
  type: FOCUS_AND_ACTIVATE_TAB,
  payload: values,
});

export interface CreateTabPayload {
  resourceId: string;
  search: string;
  tabId: string;
}
export const createTabAction = (values: CreateTabPayload) => ({
  type: CREATE_TAB,
  payload: values,
});

export interface UpdateTabSearchPayload {
  search: string;
  tabId: string;
}
export const updateTabSearchAction = (values: UpdateTabSearchPayload) => ({
  type: UPDATE_TAB_SEARCH,
  payload: values,
});

export interface StopTabPayload {
  tabId: string;
}
export const stopTabAction = (values: StopTabPayload) => ({
  type: STOP_TAB,
  payload: values,
});

export interface RemoveTabPayload {
  tabId: string;
}
export const removeTabAction = (payload: RemoveTabPayload) => ({
  type: REMOVE_TAB,
  payload: payload,
});

export interface RemoveTabCompletedPayload {
  tabId: string;
  resourceId: undefined | string;
}
export const removeTabCompletedAction = (payload: RemoveTabCompletedPayload) => ({
  type: REMOVE_TAB_COMPLETED,
  payload: payload,
});

export interface LaunchDappCompletedPayload {
  dappManifest: DappManifest;
}
export const launchDappCompletedAction = (values: LaunchDappCompletedPayload) => ({
  type: LAUNCH_DAPP_COMPLETED,
  payload: values,
});

export interface LaunchFileCompletedPayload {
  file: LoadedFile;
  tabId: string;
}
export const launchFileCompletedAction = (values: LaunchFileCompletedPayload) => ({
  type: LAUNCH_FILE_COMPLETED,
  payload: values,
});

export interface ReloadFileCompletedPayload {
  loadedFile: LoadedFile;
  tabId: string;
}
export const reloadFileCompletedAction = (values: ReloadFileCompletedPayload) => ({
  type: RELOAD_FILE_COMPLETED,
  payload: values,
});

export interface SaveIdentificationPayload {
  dappId: string;
  callId: string;
  identification: Identification;
}
export const saveIdentificationAction = (values: SaveIdentificationPayload) => ({
  type: SAVE_IDENTIFICATION,
  payload: values,
});

export interface LaunchIpAppCompletedPayload {
  ipApp: IpApp;
  tabId: string;
}
export const launchIpAppCompletedAction = (values: LaunchIpAppCompletedPayload) => ({
  type: LAUNCH_IP_APP_COMPLETED,
  payload: values,
});

export interface UpdateTransitoryStatePayload {
  resourceId: string;
  transitoryState: TransitoryState | undefined;
}
export const updateTransitoryStateAction = (values: UpdateTransitoryStatePayload) => ({
  type: UPDATE_TRANSITORY_STATE,
  payload: values,
});

export interface SetTabMutedPayload {
  tabId: string;
  muted: boolean;
}
export const setTabMutedAction = (values: SetTabMutedPayload) => ({
  type: SET_TAB_MUTED,
  payload: values,
});
