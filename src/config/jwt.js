const jwt = require('jsonwebtoken');
require('dotenv').config();

const sign = (payload, options = {}) => {
    return jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: '1d',
        ...options,
    });
};

const verify = (token) => {
    return jwt.verify(token, process.env.JWT_SECRET);
};

const decode = (token) => {
    return jwt.decode(token);
};

module.exports = {
    sign,
    verify,
    decode,
};
