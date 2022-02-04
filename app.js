// 1. Require dependencies /////////////////////////////////////////
const { render } = require("ejs");
const { text } = require("express");
const express = require("express");
const app = express();
const session = require("express-session")
const passport = require("passport")
const passportLocalMongoose = require("passport-local-mongoose")
const fs = require("fs");
const { toUnicode } = require("punycode");
const internal = require("stream");
const port = 3000;
require("dotenv").config();
const mongoose = require("mongoose");
const ObjectId = require('mongodb').ObjectId;
// connect to mongoose on port 27017
mongoose.connect("mongodb://localhost:27017/TodoDB",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
////////////////////////////////////////////////////////////////////
// 2. Create a session. The secret is used to sign the session ID.
app.use(session({
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});
////////////////////////////////////////////////////////////////////

// 3. Create the userSchema /////////////////////////////////////////
// It is important not to change these names
// passport-local-mongoose expects these. Use `username` and `password`!
const userSchema = new mongoose.Schema({
  username: String,
  password: String
})

// plugins extend Schema functionality
userSchema.plugin(passportLocalMongoose);

const User = new mongoose.model("User", userSchema);
////////////////////////////////////////////////////////////////////
// 4. Add our strategy for using Passport, using the local user from MongoDB
passport.use(User.createStrategy());

// passport.serializeUser(User.serializeUser());
// passport.deserializeUser(User.deserializeUser());
////////////////////////////////////////////////////////////////////

// creating tasks collection for the TodoDB database
const taskSchema = new mongoose.Schema({
  "text": String,
  "state": String,
  "creator": String,
  "isTaskClaimed": Boolean, 
  "claimingUser": String,
  "isTaskDone": Boolean,
  "isTaskCleared": Boolean
});
const Task = mongoose.model("Task", taskSchema);
// const task = new Task({
//   "text": "Get some vegetables from the market",
//     "state": "unclaimed",
//     "creator": "akash@gmail.com",
//     "isTaskClaimed": false,
//     "claimingUser": "reeta@gmail.com",
//     "isTaskDone": false,
//     "isTaskCleared": false
// })
// task.save().then(()=>{console.log("saved value in task collection")}); 


//importing file system for nodejs



//static files
app.use(express.static('public'));
app.use('/css', express.static(__dirname + 'public/css'));
app.use('/js', express.static(__dirname + 'public/js'));


app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");

//for index page
app.get('/', (req, res) => {
  res.render("index");
})


// -----------------------------------------------------------------------User Login, Register and LogOut-----------------------------


app.post( "/login", ( req, res ) => {
  console.log( "User " + req.body.username + " is attempting to log in" );
  const user = new User ({
      username: req.body.username,
      password: req.body.password 
  });
  req.login ( user, ( err ) => {
      if ( err ) {
          console.log( err );
          res.redirect( "/" );
      } else {
          passport.authenticate( "local" )( req, res, () => {
              res.redirect( "/todo" ); 
          });
      }
  });
});


//Registering a new User 
app.post("/register", async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  const auth = req.body["signAuthenticate"];

  try {
    const taskinfo = await Task.find();
    if (auth === "todo2021") {
      User.register({ username: req.body.username },
        req.body.password,
        (err, user) => {
          if (err) {
            console.log(err);
            res.redirect("/");
          } else {
            passport.authenticate("local")(req, res, () => {
              res.render("todo",{username : username, taskList : taskinfo});
            });
          }
        });
    }
    else {
      res.redirect("/");
    }
  } catch (error) {
    console.log(error);
  }
}); 

//logout button in todo
app.post('/logout', (req, res) => {
  console.log("A user is logging out");
  req.logout();
  res.redirect("/");
})



// ----------------------------------------------------------------Task Operations--------------------------------------------------

app.get("/todo", async (req, res) => {
  console.log("We are in /todo post");
  const username = req.user.username;
  console.log("this is in /todo", username);
  if (req.isAuthenticated()) {
    try {
      const taskinfo = await Task.find();
      res.render("todo", { username: username, taskList: taskinfo });
    } catch (error) {
      console.log(error); 
    }
  } else {
    console.log("User was not authorized.");
    res.redirect("/");
  }

});





// adding a new task 
app.post("/addtask", async (req, res) => {
  var inputvalue = req.body["inputValue"];
  if (inputvalue != "") {
    try {
      const taskinfo = new Task({ 
        text: inputvalue,
        state: "unclaimed",
        creator: req.body["email"],
        isTaskClaimed: false,
        claimingUser: "",
        isTaskDone: false,
        isTaskCleared: false
      });
      const id = taskinfo._id;
      taskinfo.save().then(() => console.log("user added one task"));   //saving value in database

      res.redirect("/todo");

    } catch (error) {
      console.log("error");
    }
  } else {
    res.redirect("/todo");
  }
});



// task is going from unclaimed to claimed but unfinished
app.post("/claim", async (req, res) => {
  let claimEmail = req.user.username;
  let claimId = req.body["id"];
  console.log("We are in /claim post")

  try {
    const claimTaskinfo = await Task.find();
    for (const claimtask of claimTaskinfo) {
      if (claimtask.state === "unclaimed" && claimtask._id.toString() === claimId) {
        var query = { _id: claimtask._id };
        var updated_value = {
          $set: {
            "state": "unfinished",
            "isTaskClaimed": true,
            "claimingUser": claimEmail,
          }
        }
      }
    }
    await Task.updateOne(query, updated_value);
    res.redirect("/todo");
  } catch (error) {
    console.log(error);
  }
});


app.post("/abandonorcomplete", async (req, res) => {
  console.log("We are n /abandonorcomplete post");
  let claimEmail = req.user.username;
  let claimId = req.body["id"];
  var Abandon = req.body["abandonButton"];
  var Checkbox = req.body["abandonCheckBox"];
  try {
    const abandonTaskinfo = await Task.find();
    if (Abandon === "Abandon") {
      for (const abandontask of abandonTaskinfo) {
        if (abandontask._id.toString() === claimId) {
          var query = { _id: abandontask._id };
          var updated_value = {
            $set: {
              "isTaskClaimed": false,
              "state": "unclaimed"
            }
          }
        }
      }
      await Task.updateOne(query, updated_value);
      res.redirect("/todo");
    } else if (Checkbox) {
      for (const checktask of abandonTaskinfo) {
        if (checktask._id.toString() === claimId) {
          var query = { _id: checktask._id };
          var updated_value = {
            $set: {
              "isTaskDone": true,
              "state": "finished",
              "isTaskClaimed": false
            }
          }
        }

      }
      await Task.updateOne(query, updated_value);
      res.redirect("/todo");
    }
  } catch (error) {
    console.log(error);
  }
});



app.post("/unfinish", async (req, res) => {
  console.log("we are in /unfinish post");
  let username = req.body["email"];
  let claimId = req.body["id"];
  try {
    const unfinishTaskinfo = await Task.find();
    for (unfinishtask of unfinishTaskinfo) {
      if (unfinishtask._id.toString() === claimId) {
        var query = { _id: unfinishtask._id };
        var updated_value = {
          $set: {
            "state": "unfinished",
            "isTaskClaimed": true,
            "isTaskDone": false
          }
        }
      }
    }
    await Task.updateOne(query, updated_value);
    res.redirect("/todo");
  } catch (error) {
    console.log(error);
  }
});




// removing all the finished tasks 
app.post("/purge", async (req, res) => {
  console.log("we are in /purge post");
  let username = req.body.email;
  try {
    const finishInfo = await Task.find();
    for (const finishtask of finishInfo) {
      if (finishtask.isTaskDone === true) {
        var query = { _id: finishtask._id };
        var updated_value = {
          $set: {
            "isTaskCleared": true
          }
        }
      }
    }
    await Task.updateOne(query, updated_value);
    res.redirect("/todo");
  } catch (error) {
    console.log(error);
  }
});



// Listen on port 3000
app.listen(port, () => console.info(`Server is running on http://localhost:${port}`));


// just to verify if everything is working or not
console.log('We made it to the end.');
