function getPackage({state, output, services}) {
  let packageNameQuery = state.get('npm.packageNameQuery').split('@');
  let query = null;

  // If first was @, put it back
  if (!packageNameQuery[0]) {
    packageNameQuery[0] = '@'
    packageNameQuery[1] = encodeURIComponent(packageNameQuery[1]);
    query = packageNameQuery.length === 2 ? packageNameQuery.join('') : packageNameQuery[0] + packageNameQuery[1] + '@' + packageNameQuery[2];
  } else {
    packageNameQuery[0] = encodeURIComponent(packageNameQuery[0]);
    query = packageNameQuery.join('@');
  }
  const url = `/api/packages/${query}`;
  services.http.get(url)
    .then(output.success)
    .catch(output.error);
}

getPackage.async = true;

export default getPackage;
