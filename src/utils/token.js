const { sign, verify, decode } = require('../config/jwt');

// Buat token dengan field standar dan opsional role
const createJWT = ({ userId, username, roleId = null, roleName = null }) => {
  return sign({ userId, username, roleId, roleName });
};



const getUserFromToken = (token) => {
    try {
        return verify(token);
    } catch (err) {
        return null;
    }
};

module.exports = {
    createJWT,
    getUserFromToken,
    decode,
};
