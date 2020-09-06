const generateRandomString = function() {
  let randomString = "";
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
  for (let i = 0; i < 6; i++) {
    randomString += characters.charAt(Math.floor(Math.random() * (characters.length)));
  }
  return randomString;
};



const findUserByEmail = function(users, email) {
  for (user_id in users) {
    // console.log(users[user_id].email);
    if (users[user_id].email === email) {
      return user_id;
    }
  }
  return false;
};



const urlsForUser = function(userID, urlDatabase) {
  let obj = {};
  for (key in urlDatabase) {
    if (userID === urlDatabase[key].userID) {
      obj[key] = urlDatabase[key];
    }
  }
  return obj;
};



module.exports = { generateRandomString, findUserByEmail, urlsForUser };



