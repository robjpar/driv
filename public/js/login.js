$(document).ready(function() {
  // When the form is submitted, we validate there's an email and password entered
  $('#log-in-button').on("click", function(event) {
    event.preventDefault();
    $('.lds-roller').show();
    $('#main-content').hide();
    setTimeout(() => {
      let userData = {
        email: $('#inputUsername').val().trim(),
        password: $('#inputPassword').val().trim()
      };

    if (!userData.email || !userData.password) {
      return;
    }
    // If we have an email and password we run the loginUser function and clear the form
    loginUser(userData.email, userData.password);
    $('#inputUsername').val("");
    $('#inputPassword').val("");
    }, 1000);
    
  });

  // loginUser does a post to our "api/login" route and if successful, redirects us the the members page
  function loginUser(email, password) {
    sessionStorage.setItem('email', email);
    $.post("/api/login", {
      email: email,
      password: password
    }).then(function(data) {
      window.location.replace(data);
      // If there's an error, log the error
    }).catch(function(err) {
      console.log(err);
    });
  };
});