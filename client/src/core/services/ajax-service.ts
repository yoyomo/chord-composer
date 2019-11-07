import { Effect, Services } from "./services";
import { Action } from "../root-reducer";

export interface AjaxConfig {
  url: string
  method: "POST" | "GET" | "PUT" | "DELETE" | "PATCH"
  json?: Object
  query?: { [k: string]: string | number }
  body?: string
  headers: { [k: string]: string }
}

export type LoadingRequest = {
  type: "loading-request"
  name: string[]
}

export function loadingRequest(name: string[]): LoadingRequest {
  return {
    type: "loading-request",
    name: name,
  }
}

export interface RequestAjaxEffect {
  effectType: "request-ajax"
  name: string[]
  config: AjaxConfig
}

export function requestAjax(name: string[], config: AjaxConfig): RequestAjaxEffect {
  return {
    effectType: "request-ajax",
    name,
    config
  }
}

export type CompleteRequestAction = {
  type: "complete-request"
  name: string[]
  success: boolean
  status: number
  response: string
  headers: string
  when: number
}

export type AjaxAction = CompleteRequestAction | LoadingRequest;

export function completeRequest(requestEffect: RequestAjaxEffect,
  status: number, response: string,
  headers: string, when = Date.now()): CompleteRequestAction {
  return {
    type: "complete-request",
    name: requestEffect.name,
    success: status >= 200 && status < 300,
    status: status,
    response: response,
    headers: headers,
    when
  }
}

export function withAjax(dispatch: (action: Action) => void, queueSize = 6, rootUrl = ""): Services {
  return (effect: Effect) => {
    let requests = {} as { [k: string]: XMLHttpRequest };
    let canceled = false;
    let xhrQueue: XMLHttpRequest[] = [];
    let configsQueue: AjaxConfig[] = [];
    let executingCount: number = 0;

    const checkAndExecuteNext = () => {
      if (canceled) return;

      while (executingCount < queueSize && xhrQueue.length && configsQueue.length) {
        let nextXhr = xhrQueue.shift();
        let nextConfig = configsQueue.shift();

        executingCount++;
        if (nextConfig && nextXhr) {
          executeXhrWithConfig(nextConfig, nextXhr, rootUrl);
        }
      }
    };

    let normalizedName: string;

    switch (effect.effectType) {
      case "request-ajax":
        normalizedName = effect.name.join("-");

        dispatch(loadingRequest(effect.name));

        let xhr = requests[normalizedName] = new XMLHttpRequest();

        const completeXhr = () => {
          executingCount--;
          if (requests[normalizedName] === xhr) {
            delete requests[normalizedName];
          }

          if (canceled) return;

          checkAndExecuteNext();
        };

        xhr.onerror = function () {
          completeXhr();

          dispatch(completeRequest(effect, 0, "", ""));
        };

        xhr.onload = function () {
          completeXhr();

          dispatch(completeRequest(effect, xhr.status, xhr.responseText, xhr.getAllResponseHeaders()));
        };

        xhr.ontimeout = function () {
          completeXhr();

          dispatch(completeRequest(effect, 408, "", ""));
        };

        if (executingCount < queueSize) {
          executingCount++;
          executeXhrWithConfig(effect.config, xhr, rootUrl);
        } else {
          xhrQueue.push(xhr);
          configsQueue.push(effect.config);
        }
    }
  }
}

export const parseHTTPHeadersToJSON = (headersStr: string) => {
  let headers: { [k: string]: string } = {};
  const regex = /([\w-]+): (.*)/g;

  let header;
  while (!!(header = regex.exec(headersStr))) {
    headers[header[1]] = header[2];
  }

  return headers;
};

export function executeXhrWithConfig(config: AjaxConfig, xhr: XMLHttpRequest, rootUrl = "") {
  xhr.withCredentials = false;

  xhr.open(config.method, getAjaxUrl(config, rootUrl), true);

  const headers: { [k: string]: string } = {
    ...config.headers, ...{
      "Accept": "application/json",
      "Content-Type": "application/json"
    }
  };

  if (headers) {
    for (let key in headers) {
      xhr.setRequestHeader(key, headers[key]);
    }
  }

  xhr.send(getAjaxBody(config));
}

export function urlJoin(root: string, path: string): string {
  if (!root) return path;
  if (!path) return root;
  if (typeof URL === 'function') {
    return new URL(path, root).toString();
  } else {
    if (root[root.length - 1] !== '/') {
      root += '/';
    }
    if (path[0] === '/') {
      path = path.substring(1);
    }
    return root + path;
  }
}

export function getAjaxUrl(config: AjaxConfig, rootUrl = ""): string {
  let url = urlJoin(rootUrl, config.url);

  const query = config.query;
  if (query) {
    let parts = [] as string[];
    for (let key in query) {
      parts.push(encodeURIComponent(key) + "=" + encodeURIComponent(query[key] as string));
    }

    if (parts.length) url += (url.indexOf("?") === -1 ? "?" : "&") + parts.join("&");
  }

  return url;
}

export function getAjaxBody(config: AjaxConfig): string | null {
  if (config.body) return config.body;
  if (config.json) return JSON.stringify(config.json);
  return null;
}
