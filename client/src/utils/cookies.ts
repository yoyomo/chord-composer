export const getCookie = (name: string): string | void => {
  var match = document.cookie.match(RegExp('(?:^|;\\s*)' + name.replace(/([.*+?^${}()|[\]/\\])/g, '\\$1') + '=([^;]*)'));
  return match ? match[1] : undefined;
};

export const setCookie = (name: string, value: string, expiryDays = 365) => {
  let d = new Date();
  d.setTime(d.getTime() + 1000 * 60 * 60 * 24 * expiryDays);
  let expires = "expires=" + d.toUTCString();

  document.cookie = name + "=" + value + ";" + expires + ";path=/";
};