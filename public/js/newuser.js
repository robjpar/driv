$('body').hide();
const API = {
  getAdmin: (userId) => {
    return $.ajax({
      url: '/check-if-admin',
      data: {id: userId},
      type: 'POST'
    });
  },
  logout: (userId) => {
    sessionStorage.removeItem('email');
    return $.ajax({
      url: '/logout',
      type: 'GET',
      data: {user: userId}
    })
  }
};
// Nav buttons
loadSearchButton = () => {
  let searchBtn = $('<a>').addClass('btn btn-info btn-sm float-right m-1').text('Search Records').attr('id', 'search-button').attr('href', '/').attr('role', 'button');
  $('#indexnav').append(searchBtn);
}

loadLogoutButton = () => {
  let logoutBtn = $('<a>').addClass('btn btn-info btn-sm float-right m-1').text('Logout').attr('id', 'logout-button').attr('role', 'button');
  $('#indexnav').append(logoutBtn);
}

loadSearchButton();
loadLogoutButton();

let username = sessionStorage.getItem('email');
API.getAdmin(username).then(data => {
  if ( data != true ) {
    window.location.href = '/';
  } else if ( data === true ) {
    $('body').show();
  }
});

// logout functionality when logout button clicked
$(document).on('click', '#logout-button', () => {
  // Route for logging user out
  API.logout(username).then(data =>  {
    window.location = '/';
  });
});

$(document).ready(function() {
  if (username === null) {
    window.location = '/login';
  } else {
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
  };

  // Does a post to the signup route. If successful, we are redirected to the members page
  // Otherwise we log any errors
  
  function handleLoginErr(err) {
    $('#alert .msg').text(err.responseJSON);
    $('#alert').fadeIn(500);
  }
});
