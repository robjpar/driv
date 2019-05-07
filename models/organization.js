module.exports = function(sequelize, DataTypes) {
  const Organization = sequelize.define("Organization", {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [1]
      }
    }
  });

  Organization.associate = function(models) {
    Organization.hasMany(models.Donor, {
      // Default: CASCADE on update and SET NULL on delete
    });
  };

  return Organization;
};
