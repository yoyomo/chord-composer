import {Action, Effect} from "../../react-root";
import {Service} from "./services";

export interface AjaxConfig {
  url: string
  method: "POST" | "GET" | "PUT" | "DELETE" | "PATCH"
  json?: Object
  query?: { [k: string]: string | number }
  body?: string
  headers?: { [k: string]: string }
}

export interface LoadingRequest {
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

export interface CompleteRequest {
  type: "complete-request"
  name: string[]
  success: boolean
  status: number
  response: string
  headers: string
  when: number
}

export type AjaxAction = CompleteRequest | LoadingRequest ;

export function completeRequest(requestEffect: RequestAjaxEffect,
                                status: number, response: string,
                                headers: string, when = Date.now()): CompleteRequest {
  return {
    type: "complete-request",
    name: requestEffect.name,
    success: status >= 200 && status < 300 || status === 304,
    status: status,
    response: response,
    headers: headers,
    when
  }
}

export function withAjax(dispatch: (action: Action) => void, queueSize = 6, rootUrl = ""): Service {
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
        if (nextConfig && nextXhr){
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
        }
        else {
          xhrQueue.push(xhr);
          configsQueue.push(effect.config);
        }
    }
  }
}

export function executeXhrWithConfig(config: AjaxConfig, xhr: XMLHttpRequest, rootUrl = "") {
  xhr.withCredentials = false;

  xhr.open(config.method, getAjaxUrl(config, rootUrl), true);

  const headers = config.headers;
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

const headerSeparator = '\u000d\u000a';
const headerValueSeparator = '\u003a\u0020';

export function parseResponseHeaders(headerStr: string) {
  let headers = {} as { [k: string]: string };
  if (!headerStr) {
    return headers;
  }

  let headerPairs = headerStr.split(headerSeparator);

  for (let i = 0, len = headerPairs.length; i < len; i++) {
    let headerPair = headerPairs[i];
    let idx = headerPair.indexOf(headerValueSeparator);
    if (idx > 0) {
      headers[headerPair.substring(0, idx).toLowerCase()] = headerPair.substring(idx + 2);
    }
  }

  return headers;
}

export function encodeResponseHeaders(headers: { [k: string]: string }) {
  return Object.keys(headers).map((k: string) => k + headerValueSeparator + headers[k]).join(headerSeparator);
}


export function encodeQueryParts(parts: { [k: string]: any }): { [k: string]: string } {
  let result = {} as { [k: string]: string };

  for (let k in parts) {
    let value = parts[k];
    if (typeof value === "string") {
      result[k] = value;
    }
    else if (typeof value === "number") {
      result[k] = value + "";
    }
    else if (Array.isArray(value)) {
      result[k] = value.join(",");
    }
    else {
      let subParts = encodeQueryParts(value);
      for (let subKey in subParts) {
        result[k + "[" + subKey + "]"] = subParts[subKey];
      }
    }
  }

  return result;
}
