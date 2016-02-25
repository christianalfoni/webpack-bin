function createBin({services, output}) {
  services.http.post('/api/bins')
    .then((response) => {
      if (typeof response.result === 'string') {
        return output.error();
      }
      output.success({
        result: response.result
      });
    })
    .catch(output.error);
}

createBin.async = true;

export default createBin;
