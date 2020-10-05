const express = require("express");
const app = express();
const PORT = 8080; // default port 8080
const { generateRandomString, findUserByEmail, urlsForUser } = require('./helpers')
const bcrypt = require('bcrypt');
const bodyParser = require("body-parser");
const cookieSession = require('cookie-session')

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieSession({
  name: 'session',
  keys: ["key1", "key2"],
}));
app.set("view engine", "ejs");

const urlDatabase = {
  b6UTxQ: { longURL: "https://www.tsn.ca", userID: "aJ48lW" },
  i3BoGr: { longURL: "https://www.google.ca", userID: "aJ48lW" },
};

const users = {
  "userRandomID": {
    id: "userRandomID",
    email: "user@example.com",
    password: bcrypt.hashSync("purple-monkey-dinosaur", 10)
  },
  "user2RandomID": {
    id: "user2RandomID",
    email: "user2@example.com",
    password: bcrypt.hashSync("dishwasher-funk", 10)
  }
};

// root redirect
app.get("/", (req, res) => {
  const user_id = req.session.user_id;
  if (user_id) {
    res.redirect("/urls");
  } else {
    res.redirect("/login");
  }
});

// all the existing urls
app.get("/urls", (req, res) => {
  const user_id = req.session.user_id;
  if (!user_id) {
    res.redirect("/login");
  } else {
    const templateVars = {
      urls: urlsForUser(user_id, urlDatabase),
      user: users[user_id]
    };
    res.render("urls_index", templateVars);
  }
});

// create new urls
app.post("/urls", (req, res) => {
  const shortURL = generateRandomString();
  urlDatabase[shortURL] = { longURL: req.body.longURL, userID: req.session.user_id };
  res.redirect(`/urls/${shortURL}`);
});

// redirect existing short url to the corresponding long url
app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL]["longURL"];
  if (req.session.user_id === urlDatabase[req.params.shortURL].userID) {
    res.redirect(longURL);
  } else {
    return res.status(403).send("Access denied!");
  }
});

// add new url
app.get("/urls/new", (req, res) => {
  let templateVars = {
    user: users[req.session.user_id]
  };
  if (!req.session.user_id) {
    res.redirect("/login");
  } else {
    res.render("urls_new", templateVars);
  }
});

// edit short urls pre attempt
app.get("/urls/:shortURL", (req, res) => {
  let templateVars = {
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL].longURL,
    user: users[req.session.user_id]
  };
  res.render("urls_show", templateVars);
});

// delete urls for existing logged-in users
app.post("/urls/:shortURL/delete", (req, res) => {
  if (req.session.user_id === urlDatabase[req.params.shortURL].userID) {
    delete urlDatabase[req.params.shortURL];
    res.redirect("/urls");
  } else {
    res.sendStatus(403);
  };
});

// edit short urls for existing logged-in users post attempt
app.post("/urls/:shortURL/edit", (req, res) => {
  if (req.session.user_id === urlDatabase[req.params.shortURL].userID) {
    urlDatabase[req.params.shortURL].longURL = req.body.longURL;
    res.redirect("/urls");
  } else {
    res.sendStatus(403);
  }
});

// login page pre login attempt
app.get("/login", (req, res) => {
  const templateVars = {
    user: users[req.session.user_id]
  };
  res.render("login", templateVars);
});

// login page post login attempt
app.post("/login", (req, res) => {
  const user_id = findUserByEmail(users, req.body.email)
  if (!user_id) {
    return res.status(403).send("User doesn't exist!");
  };
  const user = users[findUserByEmail(users, req.body.email)];
  if (bcrypt.compareSync(req.body.password, user.password)) {
    req.session.user_id = `${user_id}`;
    res.redirect("/urls");
  } else {
    return res.status(403).send("Please provide a valid password!");
  };
});

// logout page
app.post("/logout", (req, res) => {
  req.session = null;
  res.redirect("/urls");
});

// register page pre registeration attempt
app.get("/register", (req, res) => {
  let templateVars = {
    user: users[req.session.user_id],
  };
  res.render("register", templateVars);
});

// register page post registeration attempt
app.post("/register", (req, res) => {
  const userId = generateRandomString();
  const email = req.body.email;
  const password = req.body.password;
  if (email === '' || password === '') {
    res.status(400).send("Please provide a valid email and/or password.");
  } else if (findUserByEmail(users, email)) {
    res.status(400).send("User already exists!");
  } else {
    users[userId] = {
      id: userId,
      email,
      password: bcrypt.hashSync(password, 10)
    };
    req.session.user_id = userId;
    res.redirect("/urls");
  }
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

