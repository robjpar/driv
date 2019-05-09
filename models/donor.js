module.exports = function(sequelize, DataTypes) {
  var Donor = sequelize.define("Donor", {
    donorId: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [1]
      }
    },
    referralType: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [1]
      }
    },
    referredOn: {
      type: DataTypes.DATE,
      allowNull: false
    },
    age: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    ageUnits: {
      type: DataTypes.ENUM('D', 'Y'),
      allowNull: false
    },
    admissionDiagnosis: {
      type: DataTypes.STRING
    },
    prelimCauseOfDeath: {
      type: DataTypes.STRING,
    },
    asystolDeathOn: {
      type: DataTypes.DATE,
    },
    wasReferredOnVent: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    },
    wasVentRemovedPriorRef: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    },
    extubationOn: {
      type: DataTypes.DATE,
    },
    wasHeartBeating: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    },
    isFollowUp: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      default: false
    }
  });

  Donor.associate = function(models) {
    Donor.belongsTo(models.Organization, {
      foreignKey: {
        allowNull: false
      }
    });
  };

  return Donor;
};
