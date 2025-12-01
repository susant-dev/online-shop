const bcrypt = require("bcrypt");

const encodePassword = (raw) => {
  try {
    const salt = bcrypt.genSaltSync(10);
    return bcrypt.hashSync(raw, salt);
  } catch (error) {
    console.log(error.message);
    throw error;
  }
};

const matchPassword = (raw, encoded) => {
  try {
    return bcrypt.compareSync(raw, encoded);
  } catch (error) {
    console.log(error.message);
    throw error;
  }
};

module.exports = { encodePassword, matchPassword };
