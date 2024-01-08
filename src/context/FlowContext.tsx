import { createContext, Dispatch, PropsWithChildren, Reducer, useReducer } from 'react';
import { ActionMap } from '../utils';
import { DepositKeyInterface } from '../components/JSONDropzone/validation';

export interface FlowState {
  userAddress: string | null;
  depositJSON: DepositKeyInterface | null;
  fileName: string;
  depositComplete: boolean;
}

export enum FlowActionTypes {
  SET_USER_ADDRESS,
  SET_DEPOSIT_JSON,
  SET_FILE_NAME,
  DEPOSIT_COMPLETE,
}

const initialState: FlowState = {
  userAddress: null,
  depositJSON: null,
  fileName: '',
  depositComplete: false,
};

type FlowStatePayload = {
  [FlowActionTypes.SET_USER_ADDRESS]: string;
  [FlowActionTypes.SET_DEPOSIT_JSON]: DepositKeyInterface;
  [FlowActionTypes.SET_FILE_NAME]: string;
  [FlowActionTypes.DEPOSIT_COMPLETE]: boolean;
};

export type FlowStateDispatch =
  ActionMap<FlowStatePayload>[keyof ActionMap<FlowStatePayload>];

export const FlowContext = createContext<[FlowState, Dispatch<FlowStateDispatch>]>([
  initialState,
  () => {},
]);

const reducer: Reducer<FlowState, FlowStateDispatch> = (state, action) => {
  switch (action.type) {
    case FlowActionTypes.SET_USER_ADDRESS: {
      return {
        ...state,
        userAddress: action.payload,
      };
    }
    case FlowActionTypes.SET_DEPOSIT_JSON: {
      return {
        ...state,
        DepositJSON: action.payload,
      };
    }
    case FlowActionTypes.SET_FILE_NAME: {
      return {
        ...state,
        fileName: action.payload,
      };
    }
    case FlowActionTypes.DEPOSIT_COMPLETE: {
      return {
        ...state,
        depositComplete: action.payload,
      };
    }
    default: {
      return state;
    }
  }
};

export const FlowContextProvider = (props: PropsWithChildren<{}>): JSX.Element => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <FlowContext.Provider value={[state, dispatch]}>
      {props.children}
    </FlowContext.Provider>
  );
};
