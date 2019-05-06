$(document).ready(function() {
  function signUpUser(email, password, admin) {
    $.post('/api/new-user', {
      email: email,
      password: password,
      admin: admin
    }).then(function(data) {
      alert(data);
      window.location.replace(data);
      // If there's an error, handle it by throwing up a bootstrap alert
    }).catch(handleLoginErr);
  }

  // When the signup button is clicked, we validate the email and password are not blank
  $('#sign-up-button').on('click', function(event) {
    event.preventDefault();
    var userData = {
      email: $('#email-input').val().trim(),
      password: $('#password-input').val().trim(),
      admin: $('#is-admin').val().trim()
    };
    if (!userData.email || !userData.password) {
      return;
    }
    // If we have an email and password, run the signUpUser function
    signUpUser(userData.email, userData.password, userData.admin);
    $('#email-input').val('');
    $('#password-input').val('');
  });

  // Does a post to the signup route. If successful, we are redirected to the members page
  // Otherwise we log any errors
  
  function handleLoginErr(err) {
    $('#alert .msg').text(err.responseJSON);
    $('#alert').fadeIn(500);
  }
});
