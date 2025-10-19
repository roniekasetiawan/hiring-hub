"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useReducer,
  type ReactNode,
} from "react";
import type { BreadcrumbsInterface } from "@/@core/components/PageID/page-id-types";

interface MainLayoutInterface {
  breadcrumbs?: BreadcrumbsInterface;
  setBreadcrumbs: (breadcrumbs: BreadcrumbsInterface | undefined) => void;
}

type MainLayoutAction = {
  type: "SET_BREADCRUMBS";
  payload: BreadcrumbsInterface | undefined;
};

const mainLayoutReducer = (
  state: MainLayoutInterface,
  action: MainLayoutAction,
): MainLayoutInterface => {
  if (action.type === "SET_BREADCRUMBS") {
    return { ...state, breadcrumbs: action.payload };
  } else {
    return state;
  }
};

const initialState: MainLayoutInterface = {
  breadcrumbs: undefined,
  setBreadcrumbs: () => {},
};

const MainLayoutContext = createContext<MainLayoutInterface>(initialState);

export const useMainLayout = () => useContext(MainLayoutContext);

const MainLayoutProvider = ({
  children,
}: Readonly<{ children: ReactNode }>) => {
  const [state, dispatch] = useReducer(mainLayoutReducer, initialState);

  const setBreadcrumbs = useCallback(
    (breadcrumbs: BreadcrumbsInterface | undefined) => {
      return dispatch({ type: "SET_BREADCRUMBS", payload: breadcrumbs });
    },
    [],
  );

  const value = useMemo(
    () => ({
      ...state,
      setBreadcrumbs,
    }),
    [setBreadcrumbs, state],
  );

  return (
    <MainLayoutContext.Provider value={value}>
      {children}
    </MainLayoutContext.Provider>
  );
};

export default MainLayoutProvider;
