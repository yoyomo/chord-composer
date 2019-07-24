export const getCookie = (name: string): string | void => {
  var match = document.cookie.match(RegExp('(?:^|;\\s*)' + name.replace(/([.*+?^${}()|[\]/\\])/g, '\\$1') + '=([^;]*)'));
  return match ? match[1] : undefined;
};

export const setCookie = (name: string, value: string, unixTime: number) => {
  let d = new Date();
  d.setTime(1000 * unixTime);
  let expires = "expires=" + d.toUTCString();

  document.cookie = name + "=" + value + ";" + expires + ";path=/";
};