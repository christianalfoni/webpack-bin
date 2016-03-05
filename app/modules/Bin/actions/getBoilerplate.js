function getBoilerplate({input, services, output}) {
  services.http.get(`/api/boilerplates/${input.name}`)
    .then(output.success)
    .catch(output.error);
}

getBoilerplate.async = true;

export default getBoilerplate;
