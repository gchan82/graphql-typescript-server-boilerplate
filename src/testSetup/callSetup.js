// thanks to: https://github.com/facebook/jest/issues/5164
require("ts-node/register");

// If you want to reference other typescript modules, do it via require:
const {setup} = require('./Setup');

module.exports = async function () {
  // Call your initialization methods here.
  await setup();
  return null;
};