$(document).ready(() => {
  // Get references to page elements
  var $referralInformation = $('#referral-type');
  var $ageMin = $("#min-age-input");
  var $ageMax = $("#max-age-input");
  var $hospitals = $("#hospitalchoice");
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
        url: 'api/donors?ref_type=' + query.referralType + '&org=' + query.hospitals + "&min_age=" + query.ageMin + "&max_age=" + query.ageMax + "&follow_up=" + query.needsFollowup,
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
        url: 'api/donors',
        type: 'PUT',
        data: id
      });
    },
    getAdmin: (userId) => {
      return $.ajax({
        url: '/check-if-admin',
        data: {
          id: userId
        },
        type: 'POST'
      });
    },
    logout: (userId) => {
      sessionStorage.removeItem('email');
      return $.ajax({
        url: '/logout',
        type: 'GET',
        data: {
          user: userId
        }
      });
    }
  };

  function displayHospitals() {
    API.getHospitals().then(function(data) {
      data = data.map(function(element) {
        return element.name;
      }).sort();
      let hospitalList = [];
      for (var i = 0; i < data.length; i++) {
        hospitalList.push(createHospitalRow(data[i], i));
      }
      renderHospitalList(hospitalList);
    });
  }

  function createHospitalRow(hospitalData, idNumber) {
    var newHospital = $('<option value="' + hospitalData + '">' + hospitalData + '</option>');
    return newHospital;
  }

  function renderHospitalList(rows) {
    $hospitals.append(rows);
  }

  displayHospitals();

  // if user is admin, load admin button
  loadAdminButton = () => {
    let adminBtn = $('<a>').addClass('btn btn-info btn-sm m-1').text('Admin').attr('id', 'admin-button').attr('href', '/new-user').attr('role', 'button');
    $('#index-nav').append(adminBtn);
  };
  loadLogoutButton = () => {
    let logoutBtn = $('<a>').addClass('btn btn-info btn-sm float-right m-1').text('Logout').attr('id', 'logout-button').attr('role', 'button');
    $('#index-nav').append(logoutBtn);
  };

  loadAdminButton();
  loadLogoutButton();

  // logout functionality
  $(document).on('click', '#logout-button', () => {
    // Route for logging user out
    API.logout(username).then(data => {
      location.reload();
    });
  });

  // handleFormSubmit is called whenever we submit a new example
  // Save the new example to the db and refresh the list
  var handleFormSubmit = function(event) {
    var newHospital = "";
    var followUp;

    if ($hospitals.val() !== null) {
      newHospital = $hospitals.val().trim()
    }

    if ($("#needs-followup").prop('checked')) {
      followUp = "yes";
    } else {
      followUp = "no";
    }

    var userRequest = {
      referralType: $referralInformation.val().trim(),
      ageMin: $ageMin.val() == "" ? 0 : parseInt($ageMin.val()),
      ageMax: $ageMax.val() == "" ? 1000 : parseInt($ageMax.val()),
      hospitals: newHospital,
      needsFollowup: followUp,
    };

    API.getData(userRequest).then(function(data) {

      for (var i = 0; i < data.length; i++) {
        var referralId = data[i].donorId;
        var referralType = data[i].referralType;
        var age = data[i].age;
        var organization = data[i].Organization.name;
        var needsFollowup = data[i].isFollowUp;
        var checked = needsFollowup ? 'checked' : '';

        $referralData.append($('<tr><td>' + referralId + '</td><td>' + referralType + '</td><td>' + age + '</td><td>' + organization + '</td><td><input class="form-check-input case-followup" type="checkbox" value=false ' + checked + ' id="' + referralId + '"></td></tr>'));
      }
    });
  };

  $submitBtn.on('click', function(event) {
    event.preventDefault();

    if ($ageMin.val() < 0) {
      alert("Please make sure to only enter numbers greater than 0")
    }
    if ($ageMax.val() < 0) {
      alert("Please make sure to only enter numbers greater than 0")
    } else {
      handleFormSubmit();
    }
  });

  // Export Table
  $('#json').on('click', function(event) {
    $("#donorTable").tableHTMLExport({
      type: 'json',
      filename: 'donotTable.json',
      ignoreColumns: '',
      ignoreRows: ''
    });
    event.preventDefault();
  });

  $('#csv').on('click', function(event) {
    $("#donorTable").tableHTMLExport({
      type: 'csv',
      filename: 'donorTable.csv',
      ignoreColumns: '',
      ignoreRows: ''
    });
    event.preventDefault();
  });

  $('#pdf').on('click', function(event) {
    $("#donorTable").tableHTMLExport({
      type: 'pdf',
      filename: 'donorTable.pdf',
      ignoreColumns: '',
      ignoreRows: ''
    });
    event.preventDefault();
  });

  $('#clear').on('click', function(event) {
    $("#referral-info").empty();
    event.preventDefault();
  });

  $(document).on("click", ".case-followup", function(event) {

    var id = $(this).attr('id');
    var followup = true;

    if ($(".case-followup").prop("checked")) {
      followup = "yes";
    } else if (($(".case-followup").prop("checked")) === false) {
      followup = "no";
    }

    console.log($(this).attr("id"));

    var followupNeeded = {
      donorId: id,
      isFollowUp: followup
    };

    console.log(followupNeeded);

    API.updateReferral(followupNeeded);
  });
});
