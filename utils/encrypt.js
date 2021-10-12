const bcrypt = require('bcryptjs');

module.exports = async (string, num) => {
  return await bcrypt.hash(string, num);
};
