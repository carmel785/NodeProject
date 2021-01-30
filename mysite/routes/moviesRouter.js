var express = require('express');
var router = express.Router();
var moviesBl = require('../bl/moviesBl')
var usersBl = require('../bl/usersBl')

/* GET Movies page. */
router.get('/:user', function(req, res, next) {
  res.render('Movies', {user: req.params.user});
});


/* GET All Movies page. */
router.get('/allMovies/:user',async function(req, res, next) {
  var movies = await moviesBl.getAllMoviesFromWeb()
  let user = req.params.user
  let haveViews = false
  let haveUpdateMovie = false
  let haveDeleteMovie = false

  if(user!= "Carmel785@gmail.com")
  {
    let users = await usersBl.getAllUserDetails()
    let currentUser =  users.filter(u => u.userName == user)
    currentUser.forEach(x=> {
      haveViews = x.permissions.some(p=> p == "View Movies")
      haveUpdateMovie = x.permissions.some(p=> p == "Update Movie")
      haveDeleteMovie = x.permissions.some(p=> p == "Delete Movies")
    })
  }
  else
  {
    haveViews = true
    haveUpdateMovie = true
    haveDeleteMovie = true
  }
  res.render('AllMovies',{movies, user: req.params.user, haveViews , haveUpdateMovie , haveDeleteMovie })
});

//for find movie function
router.get('/allMovies/:name/:user',async function(req, res, next) {
  let movies = await moviesBl.getAllMoviesFromWeb()
  let results = movies.data.filter(m=> m.name.startsWith(req.params.name))
  let user = req.params.user
  res.render('AllMovies', {results, user});
});

/* GET Add Movie page. */
router.get('/addMovie/:user',async function(req, res, next) {
  let user = req.params.user 
  let haveCreateMovie = false
  if(user!= "Carmel785@gmail.com")
  {
  let users = await usersBl.getAllUserDetails()
  let currentUser =  users.filter(u => u.userName == user)
    currentUser.forEach(x=> {
      haveCreateMovie  = x.permissions.some(p=> p == "Create Movies")
    })
  }
  else
  {
    haveCreateMovie = true
  }
  res.render('AddMovie', {user, haveCreateMovie});
});

/* GET Add Movie and redirect it to myService route for add the movie to DB. */
router.get('/addMovieToDB/:user',async function(req, res, next) {
  console.log(typeof req.query.image)
  res.redirect('http://localhost:8000/addMovie/'+req.query.name+'/'+req.query.genres+'/'+req.query.image+'/'+req.query.premiered+'/'+req.params.user)
});

/* GET Edit Movie page. */
router.get('/editMovie/:movieName/:user',async function(req, res, next) {
  res.render('EditMovie', {movieName :req.params.movieName, user: req.params.user});
});

/* GET Edit Movie and redirect it to myService route for Edit the movie in the DB. */
router.get('/editMovieInDB/:preMovie/:user',async function(req, res, next) {
  res.redirect('http://localhost:8000/editMovie/'+req.params.preMovie+'/'+req.query.name+'/'+req.query.genres+'/'+req.query.image+'/'+req.query.premiered+'/'+req.params.user)
});

module.exports = router;
