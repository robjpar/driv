// Get references to page elements
var $referralInformation = $('#referral-type');
var $ageMin = $("#min-age-input");
var $ageMax = $("#max-age-input");
var $hospitals = $("#hospitals");
var $displayedHospitals = $(".hospitals");
var $needsFollowup = $("#needs-followup");
var $referralData = $("#referral-info");

var $submitBtn = $('#submit');

var $displayedReferrals = $("#referral-info");
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
  getData: function(query) {
    return $.ajax({
      url: 'api/donors?ref_type=' + query.referralType + '&org=' + query.hospitals,
      type: 'GET'
    });
  },
  getHospitals: function() {
    return $.ajax({
      url: 'api/organizations',
      type: 'GET'
    });
  },
  updateReferral: function(id) {
    return $.ajax({
      url: 'api/needsfollowup/' + id,
      type: 'UPDATE'
    });
  },
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
    data = data.map(function(element) {
      return element.name;
    }).sort();
    console.log(data);
    let hospitalList = [];
    for (var i = 0; i < data.length; i++) {
      hospitalList.push(createHospitalRow(data[i], i));
    }
    renderHospitalList(hospitalList);
  })
}

function createHospitalRow(hospitalData, idNumber) {
  // console.log(hospitalData);

  var newHospital = $('<input class="form-check-input hospitals" type="checkbox" value="' + idNumber + '" id="'+ hospitalData + '"><label class="form-check-label" for="' + hospitalData +'">'+ hospitalData + '</label><br>');   
  return newHospital;
}

function renderHospitalList(rows) {
  // $hospitals
  $hospitals.append(rows);
}

// if user is admin, load admin button
loadAdminButton = () => {
  let adminBtn = $('<a>').addClass('btn btn-info btn-sm m-1').text('Admin').attr('id', 'admin-button').attr('href', '/new-user').attr('role', 'button');
  $('#index-nav').append(adminBtn);
}
loadLogoutButton = () => {
  let logoutBtn = $('<a>').addClass('btn btn-info btn-sm m-1').text('Logout').attr('id', 'logout-button').attr('href', '/login').attr('role', 'button');
  $('#index-nav').append(logoutBtn);
} 


// refreshExamples gets new examples from the db and repopulates the list
// var refreshExamples = function() {
//   API.getExamples().then(function(data) {
//     var $examples = data.map(function(example) {
//       var $a = $('<a>')
//         .text(example.text)
//         .attr('href', '/example/' + example.id);

//       var $li = $('<li>')
//         .attr({
//           class: 'list-group-item',
//           'data-id': example.id
//         })
//         .append($a);

//       var $button = $('<button>')
//         .addClass('btn btn-danger float-right delete')
//         .text('ｘ');

//       $li.append($button);

//       return $li;
//     });

//     $exampleList.empty();
//     $exampleList.append($examples);
//   });
// };

// logout functionality
$('#logout-button').on('click', () => {
  console.log(username);
  // Route for logging user out
  API.logout(username).then(data =>  {
    location.reload();
  });
})

$(".form-check-input.hospitals").on("click", function() {
    console.log("it's Working!");
    console.log($(this).val());
    if ($(this).val() === false) {
      $(this).val() = true;
      queryHospitals.push($(this).data("id"))
    } else {
      $(this).val() = false
      for (var i = 0; i < queryHospitals.length; i++) {
        if (queryHospitals[i] === $(this).data("id")) {
          queryHospitals.splice(i, 1)
        }
      }
    }
  })

// handleFormSubmit is called whenever we submit a new example
// Save the new example to the db and refresh the list
var handleFormSubmit = function(event) {
  // event.preventDefault();
  
  var userRequest = {
    referralType: $referralInformation.val().trim(),
    // ageMin: parseInt($ageMin.val()),
    // ageMax: parseInt($ageMax.val()),
    hospitals: "Oregon Health and Sciences University",
    // needsFollowup: $needsFollowup.val().trim(),
  };

  console.log(userRequest);

  API.getData(userRequest).then(function(data) {

    var table = $("<table style='width:100%><tr><th>Referral Number</th><th>Referral Type</th><th>Age</th><th>Organization</th><th>Case needs follow-up?</th>");
    var td = $("<td>");
    var $referrals = data.map(function(referral) {
      var displayInfo = [];
      var referralId = td.text(referral.donorId);
      var referralType = td.text(referral.referralType);
      var age = td.text(referral.age);
      var organization = td.text(referral.organization);
      var $checkbox = $('<br><input class="form-check-input needs-followup" type="checkbox" value=false id="'+ referral.id + '">')
      // displayInfo.push(referralId, referralType, age, organization, $checkbox);
      displayInfo.push("R190500", "OTE", 45, "Oregon Health and Sciences University", $checkbox)
      return displayInfo;  
    })
    $referralData.append(table).append($referrals);
  })
}

//   API.saveExample(example).then(function() {
//     refreshExamples();
//   });

//   $exampleText.val('');
//   $exampleDescription.val('');
// };

// handleDeleteBtnClick is called when an example's delete button is clicked
// Remove the example from the db and refresh the list
// var handleDeleteBtnClick = function() {
//   var idToDelete = $(this)
//     .parent()
//     .attr('data-id');

//   API.deleteExample(idToDelete).then(function() {
//     refreshExamples();
//   });
// };

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
          loadLogoutButton();
        }
      });;
    }, 500);
    
  }
});

$submitBtn.on('click', function(event) {
  event.preventDefault();
  console.log($ageMin.val(), $ageMax.val());
  if ($ageMin.val() < 0 || $ageMin.val() > 80) {
    // $('#myModal').modal('toggle');
    alert("Please make sure to only enter numbers between 0 and 80.")
  }
  if ($ageMax.val() < 0 || $ageMax.val() > 80) {
    // $('#myModal').modal('toggle');
    alert("Please make sure to only enter numbers between 0 and 80.")
  } 
  else {
  handleFormSubmit();
}
})

$("#needs-followup").on("click", function(event) {
  event.preventDefault();
  API.updateReferral($(this).id);
})
