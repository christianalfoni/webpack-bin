function returnToList({input}) {
  console.log('User id in webpack', input.userId);
  window.location.href="http://localhost:3000/#/courses?jwt="+input.jwt + "&user=" + input.userId;
}

export default returnToList;
