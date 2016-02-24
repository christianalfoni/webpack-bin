function searchBundles({state, services, output}) {
  services.http.get(`/api/bundles?packageName=${state.get('npm.searchBundleQuery')}`)
    .then(output.success)
    .catch(output.error);
}

searchBundles.async = true;

export default searchBundles;
