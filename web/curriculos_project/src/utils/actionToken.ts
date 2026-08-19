type ActionLocation = {
  pathname: string;
  search: string;
  hash: string;
};

export function getActionToken(location: ActionLocation, names = ['token']) {
  const queryParams = new URLSearchParams(location.search);
  const fragmentParams = new URLSearchParams(location.hash.replace(/^#/, ''));

  for (const name of names) {
    const fragmentToken = fragmentParams.get(name);
    if (fragmentToken) {
      return fragmentToken;
    }

    const queryToken = queryParams.get(name);
    if (queryToken) {
      return queryToken;
    }
  }

  return '';
}

export function clearActionTokenFromUrl(pathname: string) {
  window.history.replaceState(null, document.title, pathname);
}
