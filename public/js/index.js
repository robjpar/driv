// Get references to page elements
var $referralInformation = $('#referral-type');
// var slider = new Slider('#age', {});
var $hospitals = $("#hospitals")
// var $exampleDescription = $('#example-description');
var $submitBtn = $('#submit');
// need this to check localstorage of email
let username = sessionStorage.getItem('email');


$('#to-hide').hide();

// API object for all requests
var API = {
  saveExample: function(example) {
    return $.ajax({
      headers: {
        'Content-Type': 'application/json'
      },
      type: 'POST',
      url: 'api/examples',
      data: JSON.stringify(example)
    });
  },
  // getExamples: function() {
  //   return $.ajax({
  //     url: 'api/examples',
  //     type: 'GET'
  //   });
  // },
  getHospitals: function() {
    return $.ajax({
      url: 'api/hospitals',
      type: 'GET'
    });
  },
  // deleteExample: function(id) {
  //   return $.ajax({
  //     url: 'api/examples/' + id,
  //     type: 'DELETE'
  //   });
  // },
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

function displayHospitals() {
  // $("#age").slider({});
  API.getHospitals().then(function(data) {
    let hospitalList = [];
    let dummyHospitalList = ["OHSU", "Providence", "Willamette Valley Medical Center"];
    for (var i = 0; i < dummyHospitalList.length; i++) {
      hospitalList.push(createHospitalRow(dummyHospitalList[i], i));
    }
    renderHospitalList(hospitalList);
  })
}

function createHospitalRow(hospitalData, idNumber) {
  console.log(hospitalData);
  // var container = $('#cblist');
  //  var inputs = container.find('input');
  var newHospital = $('<br><input class="form-check-input" type="checkbox" value="" id="'+ idNumber +'"><label class="form-check-label" for="' + idNumber +'">'+ hospitalData + '</label>');   
  return newHospital;
}

function renderHospitalList(rows) {
  // $hospitals
  $hospitals.append(rows);
}

// if user is admin, load admin button
loadAdminButton = () => {
  let adminBtn = $('<a>').addClass('btn btn-info btn-sm m-3 text-white float-right').text('Admin').attr('id', 'admin-button').attr('href', '/new-user').attr('role', 'button');
  $('#index-nav').append(adminBtn);
}

// logout functionality
$('#logout-button').on('click', () => {
  console.log(username);
  // Route for logging user out
  API.logout(username).then(data =>  {
    location.reload();
  });
})

// Add event listeners to the submit and delete buttons
$(document).ready(() => {
  $('#index-loader').show();
  if (username === null) {
    window.location = '/login';
  } else {
    setTimeout(() => {
      $('#index-loader').hide();
      $('#to-hide').show();
      displayHospitals();
      API.getAdmin(username).then(data => {
        if ( data === true ) {
          loadAdminButton();
        }
      });;
    }, 500);
    
  }
  
  

  
});