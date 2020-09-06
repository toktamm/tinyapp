const { assert } = require('chai');

const { findUserByEmail } = require('./helpers.js');

const testUsers = {
  "userRandomID": {
    id: "userRandomID", 
    email: "user@example.com", 
    password: "purple-monkey-dinosaur"
  },
  "user2RandomID": {
    id: "user2RandomID", 
    email: "user2@example.com", 
    password: "dishwasher-funk"
  }
};

describe('findUserByEmail', function() {
  it('should return a user with valid email', function() {
    const user = findUserByEmail(testUsers, "user@example.com")
    const expectedOutput = "userRandomID";
    assert.strictEqual(user, expectedOutput);
  });

  it('should return undefined if the email is not in the users database', () => {
    const user = findUserByEmail(testUsers, "eretrtrger@gfigefie.com");
    const expectedOutput = undefined;
    assert.equal(user, expectedOutput);
  });
});


