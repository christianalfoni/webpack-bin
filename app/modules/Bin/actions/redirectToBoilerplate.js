function redirectToBoilerplate({input, services}) {
  services.router.redirect(`/${input.name}`);
}

export default redirectToBoilerplate;
