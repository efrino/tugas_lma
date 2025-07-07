const bcrypt = require('bcrypt');

const hash = async (password) => {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
};

const compare = async (password, hashValue) => {
  return await bcrypt.compare(password, hashValue);
};

module.exports = { hash, compare };
