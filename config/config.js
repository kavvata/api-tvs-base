require("dotenv").config();

module.exports = {
  development: {
    storage: process.env.SQLITE_STORAGE,
    dialect: 'sqlite'
  },
  test: {
    storage: process.env.SQLITE_STORAGE,
    dialect: 'sqlite'
  },
  production: {
    storage: process.env.SQLITE_STORAGE,
    dialect: 'sqlite'
  }
};
