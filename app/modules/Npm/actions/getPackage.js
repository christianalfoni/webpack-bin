function getPackage({state, output, services}) {
  let packageNameQuery = state.get('npm.packageNameQuery').split('@');
  // If first was @, put it back
  if (!packageNameQuery[0]) {
    packageNameQuery[0] = '@'
    packageNameQuery[1] = encodeURIComponent(packageNameQuery[1]);
  } else {
    packageNameQuery[0] = encodeURIComponent(packageNameQuery[0]);
  }
  const url = `/api/packages/${packageNameQuery.join('')}`;
  services.http.get(url)
    .then(output.success)
    .catch(output.error);
}

getPackage.async = true;

export default getPackage;
