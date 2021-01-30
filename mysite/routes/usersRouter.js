var express = require('express');
var router = express.Router();
var usersBl = require('../bl/usersBl')

/* GET Users page. */
router.get('/:user', function(req, res, next) {
  res.render('ManageUsers', {user: req.params.user});
});


/* GET Add Users page. */
router.get('/addUsers/:user', function(req, res, next) {
  res.render('AddUser', {user: req.params.user});
});

// Getting the new user data and send it to the databases- Users.json,Permissions,Json,UsersDB
router.post('/userToDB/:user', async function(req, res, next) {
  await usersBl.addUserToJson(req.body.fname, req.body.lname, req.body.sessionTimeOut)
  await usersBl.addPermissionsToJson(req.body)
  await usersBl.addUserToDB(req.body.user)
  res.redirect('/usersRouter/users/'+req.params.user)
});

/* GET Users page. */
router.get('/users/:user',async function(req, res, next) {
  var details = await usersBl.getAllUserDetails()
  res.render('Users', {details, user: req.params.user});
});

//delete user from all db sources(mongo,users json, permissions json)
router.get('/users/delete/:userName/:user',async function(req, res, next) {
  await usersBl.deleteUser(req.params.userName)
  res.redirect('/usersRouter/users/'+req.params.user)
});

// move the user to edit User page
router.get('/editUser/:userName/:fullname/:user',async function(req, res, next) {
  res.render('editUser' , {userName : req.params.userName , fullname : req.params.fullname, user : req.params.user})
});

// Edit The User
router.post('/editUserData/:userName/:user',async function(req, res, next) {
  await usersBl.updateUser(req.body, req.params.userName)
  res.redirect('/usersRouter/users/'+req.params.user)

});

module.exports = router;
