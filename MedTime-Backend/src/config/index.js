require('dotenv').config();

const config = {
    port: process.env.PORT || 4141,
    jwtSecret: process.env.JWT_SECRET
}

module.exports = config;