// Get references to page elements
var $referralInformation = $('#referral-type');
var $ageMin = $("#min-age-input");
var $ageMax = $("#max-age-input");
var $hospitals = $("#hospitals");
var $displayedHospitals = $(".hospitals");
var dynamicallyCreatedHospitals = [];
var queryHospitals = [];
var $needsFollowup = $("#needs-followup");
var $referralData = $("#referral-info");

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
    data = data.map(function(element) {
      return element.name;
    }).sort();
    console.log(data);
    // data.forEach(function(element) {
    //   element.
    // });
    let hospitalList = [];
    // let dummyHospitalList = ["OHSU", "Providence", "Willamette Valley Medical Center"];
    for (var i = 0; i < data.length; i++) {
      // dynamicallyCreatedHospitals.push(dummyHospitalList[i]);
      hospitalList.push(createHospitalRow(data[i], i));
    }
    renderHospitalList(hospitalList);
    // console.log(dynamicallyCreatedHospitals);
  })
}

function createHospitalRow(hospitalData, idNumber) {
  // console.log(hospitalData);

  var newHospital = $('<input class="form-check-input hospitals" type="checkbox" value="' + idNumber + '" id="'+ hospitalData + '"><label class="form-check-label" for="' + hospitalData +'">'+ hospitalData + '</label><br>');   
  console.log(newHospital);
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

  function showData() {
    var $referrals = data.map(function(referral) {
      var $a = $("<a>")
        .text(referral.text)
        .attr("href", "/referral/" + referral.id);
      var $li = $("<li>")
        .attr({
          class: "list-group-item",
          "data-id": referral.id
        })
        .append($a);
  
      var $checkbox = $('<br><input class="form-check-input referrals" type="checkbox" value=false id="'+ hospitalData + '"><label class="form-check-label" for="' + hospitalData +'">'+ hospitalData + '</label>')
  })
  }


// handleFormSubmit is called whenever we submit a new example
// Save the new example to the db and refresh the list
var handleFormSubmit = function(event) {
//   event.preventDefault();
  console.log(queryHospitals);

  // for (var i = 0; i < dynamicallyCreatedHospitals.length; i++) {
  //   if ($("#" + dynamicallyCreatedHospitals[i]).val()) {
  //     queryHospitals.push(dynamicallyCreatedHospitals[i])
  //   }
  // }

  var userRequest = {
    referralType: $referralInformation.val().trim(),
    ageMin: parseInt($ageMin.val()),
    ageMax: parseInt($ageMax.val()),
    hospitals: queryHospitals,
    needsFollowup: $needsFollowup.val().trim(),
  };

  console.log(userRequest);
  console.log("Yes");
  queryHospitals = [];

  API.getData(userRequest).then(function() {
    showData();
  });
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

$submitBtn.on('click', handleFormSubmit);
