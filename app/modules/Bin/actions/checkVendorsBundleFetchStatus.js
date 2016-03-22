function checkVendorsBundleFetchStatus({input, state, services, output}) {
  var checkStatus = () => {
    services.http.get(`/api/npm/${input.result.id}`)
      .then((response) => {
        if (response.result.isDone) {
          output.success();
        } else {
          setTimeout(checkStatus, 5000);
        }
      })
      .catch(output.error);
  }
  checkStatus();
}

checkVendorsBundleFetchStatus.async = true;

export default checkVendorsBundleFetchStatus;
