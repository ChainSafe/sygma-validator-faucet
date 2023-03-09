import React, {
  createContext,
  Dispatch,
  PropsWithChildren,
  Reducer,
  useReducer,
} from "react";
import { ActionMap } from "../utils";
import Web3 from "web3";

export enum AppStakeEnum {
  UPLOAD,
  VALIDATION,
  CONNECT_WALLET,
  SUMMARY,
  TRANSACTIONS,
  SUCCESS,
  FALIURE,
}

export interface AppState {
  step: AppStakeEnum;
  userAddress: string | null;
  web3provider: Web3 | null;
}

export enum AppActionTypes {
  SET_STAKE_STEP,
  SET_USER_ADDRESS,
  SET_WEB3_PROVIDER,
}

const initialState: AppState = {
  step: AppStakeEnum.UPLOAD,
  userAddress: null,
  web3provider: null,
};

type AppStatePayload = {
  [AppActionTypes.SET_STAKE_STEP]: AppStakeEnum;
  [AppActionTypes.SET_USER_ADDRESS]: string;
  [AppActionTypes.SET_WEB3_PROVIDER]: Web3;
};

export type AppStateDispatch =
  ActionMap<AppStatePayload>[keyof ActionMap<AppStatePayload>];

export const ClaimContext = createContext<
  [AppState, Dispatch<AppStateDispatch>]
>([initialState, () => {}]);

const reducer: Reducer<AppState, AppStateDispatch> = (state, action) => {
  switch (action.type) {
    case AppActionTypes.SET_STAKE_STEP: {
      return {
        ...state,
        step: action.payload,
      };
    }
    case AppActionTypes.SET_USER_ADDRESS: {
      return {
        ...state,
        userAddress: action.payload,
      };
    }
    case AppActionTypes.SET_WEB3_PROVIDER: {
      return {
        ...state,
        web3provider: action.payload,
      };
    }
    default: {
      return state;
    }
  }
};

export const ClaimContextProvider = (
  props: PropsWithChildren<{}>
): JSX.Element => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <ClaimContext.Provider value={[state, dispatch]}>
      {props.children}
    </ClaimContext.Provider>
  );
};
