function isAdmin({state, input, output, services}) {
  services.http.get('http://localhost:3000/api/users/' + state.get('bin.user'))
  .then(res => {
    output.success(res.result.user.isAdmin)
  })
  .catch(output.error)
}
