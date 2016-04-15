function returnToList({input}) {
  window.location.href="http://localhost:3000?jwt="+input.jwt;
}

export default returnToList;
