// Get references to page elements
var $referralInformation = $('#referral-type');
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> e9df151c64cacddac08b4c075368d915ea5fe25d
var $ageMin = $("#min-age-input");
var $ageMax = $("#max-age-input");
var $hospitals = $("#hospitals");
var $displayedHospitals = $(".hospitals");
var dynamicallyCreatedHospitals = [];
var $needsFollowup = $("#needs-followup");
var $exampleDescription = $('#example-description');
<<<<<<< HEAD
=======
// var slider = new Slider('#age', {});
var $hospitals = $("#hospitals")
// var $exampleDescription = $('#example-description');
>>>>>>> master
=======

>>>>>>> e9df151c64cacddac08b4c075368d915ea5fe25d
var $submitBtn = $('#submit');
// var $exampleList = $('#example-list');
// $("#ex2").slider({});

// need this to check localstorage of email
let username = sessionStorage.getItem('email');


// The API object contains methods for each kind of request we'll make
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
  }
};

function displayHospitals() {
  // $("#age").slider({});
  API.getHospitals().then(function(data) {
    let hospitalList = [];
    let dummyHospitalList = ["OHSU", "Providence", "Willamette Valley Medical Center"];
    for (var i = 0; i < dummyHospitalList.length; i++) {
      dynamicallyCreatedHospitals.push(dummyHospitalList[i]);
      hospitalList.push(createHospitalRow(dummyHospitalList[i], i));
    }
    renderHospitalList(hospitalList);
    console.log(dynamicallyCreatedHospitals);
  })
}

function createHospitalRow(hospitalData, idNumber) {
  console.log(hospitalData);
<<<<<<< HEAD

<<<<<<< HEAD
  var newHospital = $('<br><input class="form-check-input hospitals" type="checkbox" id="'+ hospitalData + '"><label class="form-check-label" for="' + hospitalData +'">'+ hospitalData + '</label>');   
=======
  // var container = $('#cblist');
  //  var inputs = container.find('input');

  var newHospital = $('<input class="form-check-input hospitals" type="checkbox" value="" id="'+ hospitalData + '"><label class="form-check-label" for="' + hospitalData +'">'+ hospitalData + '</label><br>');   
>>>>>>> master
=======
  
  var newHospital = $('<br><input class="form-check-input hospitals" type="checkbox" id="'+ hospitalData + '"><label class="form-check-label" for="' + hospitalData +'">'+ hospitalData + '</label>');   
>>>>>>> e9df151c64cacddac08b4c075368d915ea5fe25d
  return newHospital;
}

function renderHospitalList(rows) {
  // $hospitals
  $hospitals.append(rows);
}

loadAdminButton = () => {
  let adminBtn = $('<a>').addClass('btn btn-info btn-sm float-right').text('Admin').attr('id', 'admin-button').attr('href', '/new-user').attr('role', 'button');
  $('.navbar').append(adminBtn);
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

// handleFormSubmit is called whenever we submit a new example
// Save the new example to the db and refresh the list
// var handleFormSubmit = function(event) {
//   event.preventDefault();

<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> e9df151c64cacddac08b4c075368d915ea5fe25d
  // function checkValues() {
  //   if (ageMin )
  // }
  let queryHospitals = [];
  for (var i = 0; i < dynamicallyCreatedHospitals.length; i++) {
    if ($("#" + dynamicallyCreatedHospitals[i]).val()) {
      queryHospitals.push(dynamicallyCreatedHospitals[i])
    }
  }

  var userRequest = {
    referralType: $referralInformation.val().trim(),
    ageMin: parseInt($ageMin.val()),
    ageMax: parseInt($ageMax.val()),
    hospitals: [queryHospitals],
    needsFollowup: $needsFollowup.val().trim(),
  };
<<<<<<< HEAD
=======
//   var example = {
//     text: $exampleText.val().trim(),
//     description: $exampleDescription.val().trim()
//   };

//   if (!(example.text && example.description)) {
//     alert('You must enter an example text and description!');
//     return;
//   }
>>>>>>> master
=======
>>>>>>> e9df151c64cacddac08b4c075368d915ea5fe25d

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
  displayHospitals();
  API.getAdmin(username).then(data => {
    // sessionStorage.setItem('isAdmin', data);
    // console.log(sessionStorage.getItem('isAdmin'));
    if ( data === true ) {
      loadAdminButton();
    }
    // if (sessionStorage.getItem('isAdmin') === 'true') {
    //   console.log('yes');
    // }
  });;
})

// $submitBtn.on('click', handleFormSubmit);
// $exampleList.on('click', '.delete', handleDeleteBtnClick);
