import { BeesLoadErrors, BeesLoadCompleted, BeesLoadErrorWithArgs } from '@fabcotech/bees';
import { Tab, Identification, TransitoryState } from '/models';
import { DappyLoadErrorWithArgs, SimpleError } from '/models/DappyLoadError';

export const UPDATE_TABS_FROM_STORAGE = '[Dapps] Update tabs from storage';

export const UPDATE_SEARCH = '[Dapps] Update search';
export const CLEAR_SEARCH_AND_LOAD_ERROR = '[Dapps] Clear search and load error';
export const LOAD_RESOURCE = '[Dapps] Load resource';
export const INIT_TRANSITORY_STATE_AND_RESET_LOAD_ERROR =
  '[Dapps] Init transitory state and reset load error';
export const UPDATE_LOAD_STATE = '[Dapps] Update load state';
export const LOAD_RESOURCE_FAILED = '[Dapps] Load resource failed';

export const UNFOCUS_ALL_TABS = '[Dapps] Unfocus all tabs';
export const DID_CHANGE_FAVICON = '[Dapps] Tab favicon did update';
export const FOCUS_TAB = '[Dapps] Focus tab';
export const FOCUS_AND_ACTIVATE_TAB = '[Dapps] Focus and activate tab';
export const CREATE_TAB = '[Dapps] Create tab';
export const UPDATE_TAB_SEARCH = '[Dapps] Update tab search';
export const LAUNCH_TAB_COMPLETED = '[Dapps] Launch tab completed';
export const UPDATE_TRANSITORY_STATE = '[Dapps] Update transitory state';
export const REMOVE_TAB = '[Dapps] Remove tab';
export const REMOVE_TAB_COMPLETED = '[Dapps] Remove tab completed';
export const STOP_TAB = '[Dapps] Stop tab';
export const REMOVE_RESOURCE = '[Dapps] Remove resource';
export const SET_TAB_MUTED = '[Dapps] Set tab muted';
export const SET_TAB_FAVORITE = '[Dapps] Set tab favorite';
export const UPDATE_TAB_URL_AND_TITLE = '[Dapps] Update tab url and title';

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
export const initTransitoryStateAndResetLoadErrorAction = (
  payload: InitTransitoryStateAndResetLoadErrorPayload
) => ({
  type: INIT_TRANSITORY_STATE_AND_RESET_LOAD_ERROR,
  payload,
});

export interface LoadResourcePayload {
  tabId?: string;
  url: string;
}
export const loadResourceAction = (payload: LoadResourcePayload) => ({
  type: LOAD_RESOURCE,
  payload,
});

export interface UpdateLoadStatePayload {
  resourceId: string;
  loadState: { completed: BeesLoadCompleted; errors: BeesLoadErrors; pending: string[] };
}
export const updateLoadStateAction = (values: UpdateLoadStatePayload) => ({
  type: UPDATE_LOAD_STATE,
  payload: values,
});

export interface LoadResourceFailedPayload {
  url: string;
  tabId: string;
  error: BeesLoadErrorWithArgs | DappyLoadErrorWithArgs | SimpleError;
}
export const loadResourceFailedAction = (values: LoadResourceFailedPayload) => ({
  type: LOAD_RESOURCE_FAILED,
  payload: values,
});

export const unfocusAllTabsAction = () => ({
  type: UNFOCUS_ALL_TABS,
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
  url: string;
}
export const focusAndActivateTabAction = (values: FocusAndActivateTabPayload) => ({
  type: FOCUS_AND_ACTIVATE_TAB,
  payload: values,
});

export interface CreateTabPayload {
  resourceId: string;
  url: string;
  tabId: string;
}
export const createTabAction = (values: CreateTabPayload) => ({
  type: CREATE_TAB,
  payload: values,
});

export interface UpdateTabSearchPayload {
  url: string;
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

export interface RemoveResourcePayload {
  tabId: string;
}
export const removeResourceAction = (values: RemoveResourcePayload) => ({
  type: REMOVE_RESOURCE,
  payload: values,
});

export interface RemoveTabPayload {
  tabId: string;
}
export const removeTabAction = (payload: RemoveTabPayload) => ({
  type: REMOVE_TAB,
  payload,
});

export interface DidChangeFaviconPayload {
  img: string;
  tabId: string;
}
export const didChangeFaviconAction = (values: DidChangeFaviconPayload) => ({
  type: DID_CHANGE_FAVICON,
  payload: values,
});

export interface RemoveTabCompletedPayload {
  tabId: string;
}
export const removeTabCompletedAction = (payload: RemoveTabCompletedPayload) => ({
  type: REMOVE_TAB_COMPLETED,
  payload,
});

export interface SaveIdentificationPayload {
  tabId: string;
  callId: string;
  identification: Identification;
}
export const saveIdentificationAction = (values: SaveIdentificationPayload) => ({
  type: SAVE_IDENTIFICATION,
  payload: values,
});

export interface LaunchTabCompletedPayload {
  tab: Tab;
}
export const launchTabCompletedAction = (values: LaunchTabCompletedPayload) => ({
  type: LAUNCH_TAB_COMPLETED,
  payload: values,
});

export interface UpdateTransitoryStatePayload {
  tabId: string;
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

export interface SetTabFavoritePayload {
  tabId: string;
  favorite: boolean;
}
export const setTabFavoriteAction = (values: SetTabFavoritePayload) => ({
  type: SET_TAB_FAVORITE,
  payload: values,
});

export interface UpdateTabUrlAndTitlePayload {
  url: string;
  tabId: string;
  title: string;
}
export const updateTabUrlAndTitleAction = (values: UpdateTabUrlAndTitlePayload) => ({
  type: UPDATE_TAB_URL_AND_TITLE,
  payload: values,
});
