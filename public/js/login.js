$('#log-in-button').on('click', () => {
  event.preventDefault();
  const username = $('#inputUsername').val();
  const password = $('#inputPassword').val();
  console.log(username, password);

  let user = {
    username: username,
    password: password
  };
  $.get('/check-login', {username: username, password: password}, (result) => {
    console.log(result);
    console.log('success!');
  });
})