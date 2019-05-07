$('body').hide();
const API = {
  getAdmin: (userId) => {
    return $.ajax({
      url: '/check-if-admin',
      data: {id: userId},
      type: 'POST'
    });
  }
};

let username = sessionStorage.getItem('email');
API.getAdmin(username).then(data => {
  if ( data != true ) {
    window.location.href = '/';
  } else if ( data === true ) {
    $('body').show();
  }
});

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

// Nav buttons
loadAdminButton = () => {
  let adminBtn = $('<a>').addClass('btn btn-info btn-sm float-right m-1').text('Admin').attr('id', 'admin-button').attr('href', '/new-user').attr('role', 'button');
  $('.navbar').append(adminBtn);
}

loadLogoutButton = () => {
  let logoutBtn = $('<a>').addClass('btn btn-info btn-sm float-right m-1').text('Logout').attr('id', 'logout-button').attr('href', '/login').attr('role', 'button');
  $('.navbar').append(logoutBtn);
}

$(document).ready(() => {
  loadAdminButton();
  loadLogoutButton();
});
