var express = require('express');
var router = express.Router();
var indexBl = require('../bl/indexBl')

/* GET Login page. */
router.get('/', function(req, res, next) {
  res.render('Login', {});
});

// check if the user is a member in the DB
router.get('/checkLogin',async function(req, res, next) {
  var isExist = await indexBl.findUser(req.query)

  if(isExist == true)
  {
    res.redirect('/main/'+req.query.user)
  }
  else
  {
    res.status(401);
    return res.send("Login is failed, The member is not exist in the data base")
  }
});


/* GET Create Account page. */
router.get('/createAccount', function(req, res, next) {
  res.render('CreateAccount', {});
});

/* GET Main page. */
router.get('/main/:user', function(req, res, next) {
  res.render('Main', {user: req.params.user});
});

// check if there is a user in the database for making a member
router.get('/checkUser', async function(req, res, next) {
 var isExist = await indexBl.findUser(req.query)
 if(isExist == true || isExist == "Updated!")
 {
   res.redirect("/")
 }
 else
 {
  res.status(401);
  return res.send("Creation is failed, The user is not exist in the data base")
 }
});

module.exports = router;
