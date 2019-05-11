const fs = require('fs');
const csv = require('csv');

module.exports = function(csvFileName, db) {
  const input = fs.createReadStream(csvFileName);
  const parser = csv.parse({
    columns: true
  });

  const transform = csv.transform(function(row) {

    const donor = {
      donorId: row['EyeDonorId'],
      referralType: row['Referral Type'],
      referredOn: new Date(row['ReferredOn']),
      age: row['Age'],
      ageUnits: row['AgeUnits'],
      admissionDiagnosis: row['AdmissionDiagnosis'],
      prelimCauseOfDeath: row['PreliminaryCauseOfDeath'],
      asystolDeathOn: !isNaN(new Date(row['Asystol Death PCT'])) ? new Date(row['Asystol Death PCT']) : null,
      wasReferredOnVent: row['ReferredOnVent'] === 'Yes' ? true : false,
      wasVentRemovedPriorRef: row['RemovedFromVentPriorToReferral?'] === 'Yes' ? true : false,
      extubationOn: !isNaN(new Date(row['Extubation PCT'])) ? new Date(row['Extubation PCT']) : null,
      wasHeartBeating: row['WasHeartBeatingg?'] === 'Yes' ? true : false,
      isFollowUp: false
    };

    const organization = {
      name: row['Referring Organization']
    };

    db.Organization.findOrCreate({
      where: organization
    }).then(function([results, created]) {
      if (created) {
        console.log(`>>> Created an organization, name: ${results.name}`);
      }
      donor.OrganizationId = results.id;

      db.Donor.findOrCreate({
        where: {
          donorId: donor.donorId
        },
        defaults: donor
      }).then(function([results, created]) {
        if (created) {
          console.log(`>>> Created a donor, donorId: ${results.donorId}`);
        }
      });
    });

  });

  input.pipe(parser).pipe(transform);
};
