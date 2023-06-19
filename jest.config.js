
module.exports = {
    transform: {
      '^.+\\.jsx?$': 'babel-jest'
    },
    setupFiles: ['dotenv/config'],
    testEnvironment: 'jsdom',
    "moduleNameMapper": {
      "\\.(scss)$": "./src/pages/test/styleMock.js",
    },
    
  };
