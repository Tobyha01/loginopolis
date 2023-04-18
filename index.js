const express = require('express');
const app = express();
const { User } = require('./db');
const bcrypt = require("bcryptjs")

app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.get('/', async (req, res, next) => {
  try {
    res.send('<h1>Welcome to Loginopolis!</h1><p>Log in via POST /login or register via POST /register</p>');
  } 
  catch (error) {
    console.error(error);
    next(error)
  }
});

// POST /register
// TODO - takes req.body of {username, password} and creates a new user with the hashed password
app.post("/register", async function(request, response, next){
  try{
    SALT_LENGTH = 10
    const {username, password} = request.body
    const hash = await bcrypt.hash(password, SALT_LENGTH)
    const user = await User.create({username, password: hash})

    response.status(200).send(`successfully created user ${username}`)  
  }
  catch(error){
    next(error)
    response.status(500).send({error: error.toString()})

  }
})

// POST /login
// TODO - takes req.body of {username, password}, finds user by username, and compares the password with the hashed version from the DB
app.post("/login", async function(request, response, next){
  try{
    const {username, password} = request.body
    const user = await User.findOne({where: {username}})
    if(user){
      const matches = await bcrypt.compare(password, user.password)

      if(matches){
        response.send(`successfully logged in user ${username}`)
      }
      else{
        response.status(401).send("incorrect username or password")
      }
    }

    else{
      response.status(401).send("invalid username")
    }
  }

  catch(error){
    next(error)
    response.status(500).send(error.toString())
  }
})
// we export the app, not listening in here, so that we can run tests
module.exports = app;
