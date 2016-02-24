function getPackage({state, output, services}) {
  const url = `/api/packages/${state.get('npm.packageNameQuery')}`;
  services.http.get(url)
    .then(output.success)
    .catch(output.error);
}

getPackage.async = true;

export default getPackage;
