import {
  AjaxConfig, encodeQueryParts,
  requestAjax
} from "./services/ajax";

export type RequestJsonResourceQuery = {
  include?: string[],
  sort?: string[],
  page?: { size?: number, number?: number }
  filter?: { [k: string]: string | number | {} }
}

export const jsonResourceHeaders = {} as { [k: string]: string };
jsonResourceHeaders['Accept'] = "application/vnd.api+json";
jsonResourceHeaders['Content-Type'] = "application/vnd.api+json";

export function requestResourceWrite(name: string[], data: any, createUrl?: string) {
  let ajaxConfig = {} as AjaxConfig;

  ajaxConfig.headers = jsonResourceHeaders;

  if (data.links) {
    ajaxConfig.url = data.links.self;
  }
  else if (createUrl) {
    ajaxConfig.url = createUrl;
  }
  else {
    throw new Error("Cannot write resource without self link or createUrl! " + JSON.stringify(data));
  }

  if (data.id) {
    ajaxConfig.method = "PATCH";
  }
  else {
    ajaxConfig.method = "POST";
  }

  data = {...data};
  if ('id' in data && !data.id) {
    delete data.id;
  }

  if ('links' in data) {
    delete data.links;
  }

  ajaxConfig.json = {data};
  return requestAjax(name, ajaxConfig);
}

export function requestResourcePut(name: string[], url: string, query: RequestJsonResourceQuery = {}) {
  let ajaxConfig = {} as AjaxConfig;
  ajaxConfig.url = url;
  ajaxConfig.method = "PUT";
  ajaxConfig.headers = jsonResourceHeaders;

  if (query) {
    ajaxConfig.query = encodeQueryParts(query);
  }

  return requestAjax(name, ajaxConfig);
}

export function requestResourceFetch(name: string[], url: string, query: RequestJsonResourceQuery = {}) {
  let ajaxConfig = {} as AjaxConfig;
  ajaxConfig.url = url;
  ajaxConfig.method = "GET";
  ajaxConfig.headers = jsonResourceHeaders;

  if (query) {
    ajaxConfig.query = encodeQueryParts(query);
  }

  return requestAjax(name, ajaxConfig);
}