import { createBrowserRouter, Params, Path } from "react-router-dom"
import { App, ErrorPage } from "./App"
import { TActionID } from "./contexts"
import { exists } from "./lib"
import { TProviderID, TSupportedIDE } from "./types"
import {
  Action,
  Actions,
  AddProvider,
  CreateWorkspace,
  ListProviders,
  ListWorkspaces,
  Provider,
  Providers,
  Settings,
  Workspaces,
} from "./views"

export const Routes = {
  ROOT: "/",
  SETTINGS: "/settings",
  WORKSPACES: "/workspaces",
  ACTIONS: "/actions",
  get ACTION() {
    return `${Routes.ACTIONS}/:action`
  },
  get WORKSPACE_CREATE() {
    return `${Routes.WORKSPACES}/new`
  },
  toWorkspaceCreate(
    options: Readonly<{
      providerID: TProviderID | null
      ide: string | null
      rawSource: string | null
    }>
  ): Partial<Path> {
    const searchParams = new URLSearchParams()
    for (const [key, value] of Object.entries(options)) {
      if (exists(value)) {
        searchParams.set(key, value)
      }
    }

    return {
      pathname: Routes.WORKSPACE_CREATE,
      search: searchParams.toString(),
    }
  },
  toAction(actionID: TActionID) {
    return `${Routes.ACTIONS}/${actionID}`
  },
  getActionID(params: Params<string>): string | undefined {
    // Needs to match `:action` from detail route exactly!
    return params["action"]
  },
  getWorkspaceCreateParamsFromSearchParams(searchParams: URLSearchParams): Partial<
    Readonly<{
      providerID: TProviderID
      ide: TSupportedIDE
      rawSource: string
    }>
  > {
    return {
      providerID: searchParams.get("providerID") ?? undefined,
      ide: (searchParams.get("ide") as TSupportedIDE | null) ?? undefined,
      rawSource: searchParams.get("rawSource") ?? undefined,
    }
  },
  PROVIDERS: "/providers",
  get PROVIDER() {
    return `${Routes.PROVIDERS}/:provider`
  },
  get PROVIDER_ADD() {
    return `${Routes.PROVIDERS}/add`
  },
  toProvider(providerID: string) {
    return `${Routes.PROVIDERS}/${providerID}`
  },
  getProviderId(params: Params<string>): string | undefined {
    // Needs to match `:provider` from detail route exactly!
    return params["provider"]
  },
} as const

export const router = createBrowserRouter([
  {
    path: Routes.ROOT,
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: Routes.WORKSPACES,
        element: <Workspaces />,
        children: [
          {
            index: true,
            element: <ListWorkspaces />,
          },
          {
            path: Routes.WORKSPACE_CREATE,
            element: <CreateWorkspace />,
          },
        ],
      },
      {
        path: Routes.PROVIDERS,
        element: <Providers />,
        children: [
          { index: true, element: <ListProviders /> },
          {
            path: Routes.PROVIDER,
            element: <Provider />,
          },
          {
            path: Routes.PROVIDER_ADD,
            element: <AddProvider />,
          },
        ],
      },
      {
        path: Routes.ACTIONS,
        element: <Actions />,
        children: [{ path: Routes.ACTION, element: <Action /> }],
      },
      { path: Routes.SETTINGS, element: <Settings /> },
    ],
  },
])
