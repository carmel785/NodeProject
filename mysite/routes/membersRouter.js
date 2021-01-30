var express = require('express');
var router = express.Router();
var moviesBl = require('../bl/moviesBl')
var usersBl = require('../bl/usersBl')

/* GET Subscriptions page. */
router.get('/:user',async function(req, res, next) {
  let user = req.params.user 
  let haveSubscriptionsView = false
  if(user!= "Carmel785@gmail.com")
  {
  let users = await usersBl.getAllUserDetails()
  let currentUser =  users.filter(u => u.userName == user)
  console.log(currentUser)
    currentUser.forEach(x=> {
     haveSubscriptionsView  = x.permissions.some(p=> p == "View Subscriptions")
    })
  }
  else
  {
    haveSubscriptionsView = true
  }
  res.render('Subscriptions', {user, haveSubscriptionsView});
});

router.get('/allMembers/:response/:members/:watchList/:subscriptions/:user', async function(req, res, next) {
  var response = req.params.response
  var members = JSON.parse(req.params.members)
  var subscriptions = req.params.subscriptions
  var movies = await moviesBl.getAllMoviesFromWeb()
  var watchList = req.params.watchList;

  var haveSubscriptionsUpdate = false
  var haveSubscriptionsDelete = false
  if(req.params.user!= "Carmel785@gmail.com")
  {
  let users = await usersBl.getAllUserDetails()
  let currentUser =  users.filter(u => u.userName == req.params.user)
  console.log(currentUser)
    currentUser.forEach(x=> {
      haveSubscriptionsUpdate  = x.permissions.some(p=> p == "Update Subscription")
      haveSubscriptionsDelete  = x.permissions.some(p=> p == "Delete Subscriptions")
    })
  }
  else
  {
    haveSubscriptionsUpdate = true
    haveSubscriptionsDelete = true
  }
  
  if(response == "false")
  {
    res.redirect('http://localhost:8000/getMembersAndSubscriptions/'+req.params.user)
  }
  else
  {
    subscriptions = JSON.parse(req.params.subscriptions)
    if(subscriptions != undefined)
    {
        //אתחול של המשתנשים שרואים סרטים
      if(req.session.memberDetails == undefined)
      {
        req.session.memberDetails = []
        members.forEach(m =>
          {
            subscriptions.forEach(s=>{
              if(m._id == s.MemberId)
              req.session.memberDetails.push(m.Name)
            })
          })
        req.session.memberMoviesArray = []
        req.session.memberDetails.forEach(x=>
          {
            req.session.memberMoviesArray.push(movies.data)
          })
         
      }


       //check if the movie already watched so it wont show it again in the list:
            // req.session.memberMoviesArray = movies.data
           /* subscriptions.forEach(mov => 
              {
                mov.Movies.forEach(x=>
                  {
                    console.log(watchList.length)
                        if(watchList.length == 1)
                        {
                          var index = req.session.memberMoviesArray.findIndex(m=>{
                            // console.log("m name= "+m.name)
                            // console.log("x.movieName "+x.movieName)

                            if(x.movieName == m.name)
                            {
                              console.log(m.name)
                              return m.id
                            }
                           })
                            // arrMov.splice(index,1)
                        }
                        else
                        {
              console.log("thats -1")

                          req.session.memberMoviesArray.forEach(arrMov=>
                            {
                            var index = arrMov.findIndex(m=>{
                              if(x.movieName == m.name)
                              {
                                console.log(m.name)
                                return m.id
                              }
                            })
                              arrMov.splice(index,1)
                            })
                        }
                            
                     
                })
              })
              */
                // req.session.memberMoviesArray.forEach(x=> x.forEach(y=>console.log(y.name)))
                //req.session.memberMoviesArray[0].forEach(x=> x.forEach(y=> console.log(y.name)))

              
    
        //check if any watch list button clicked
        if(watchList!= 0)
        {
          console.log("thats 1")
          if(req.session.memberDetails != undefined)
          {
            console.log("thats 3")
            
            //check if the member subscribe for new movie button already open
            if(req.session.watchListMembers)
            {
              var checkSecondClick = req.session.watchListMembers.some(x=> x == watchList)
              console.log(checkSecondClick)
              if(checkSecondClick == false)
              {
                console.log("thats 4")
                req.session.watchListMembers.push(watchList)
              //session of array of arrays - every member have all the movies he didnt see.
              //req.session.memberMoviesArray.push(movies.data)
              console.log("watch list: "+req.session.watchListMembers)
              console.log("members array: "+req.session.memberDetails)
                res.render('AllMembers', {members, memberWatchList : req.session.memberDetails, movies: movies.data, moviesList: req.session.memberMoviesArray, subscriptions, watchListMembers : req.session.watchListMembers, user: req.params.user, haveSubscriptionsUpdate, haveSubscriptionsDelete })
              }
              else
              {
                console.log("thats 6")
                let index = req.session.watchListMembers.findIndex(x=>x == watchList)
                req.session.watchListMembers.splice(index,1)
                console.log("watch list: "+req.session.watchListMembers)
                res.render('AllMembers', {members, memberWatchList : req.session.memberDetails, movies: movies.data, moviesList: req.session.memberMoviesArray, subscriptions, watchListMembers: req.session.watchListMembers , user: req.params.user, haveSubscriptionsUpdate, haveSubscriptionsDelete})
              }
            }
            else
            {
              console.log("thats 7")
            
              req.session.watchListMembers = [watchList]
              console.log("watch list: "+req.session.watchListMembers)
              res.render('AllMembers', {members, memberWatchList : req.session.memberDetails, movies: movies.data, moviesList: req.session.memberMoviesArray, subscriptions, watchListMembers : req.session.watchListMembers, user: req.params.user, haveSubscriptionsUpdate, haveSubscriptionsDelete})
            }
            
          } 
          else
          {
            console.log("thats 2")
            //session of array of arrays - every member have all the movies he didnt see.
            req.session.memberDetails = [watchList]
            res.render('AllMembers', {members , memberWatchList: req.session.memberDetails, movies: movies.data, subscriptions, user: req.params.user, haveSubscriptionsUpdate, haveSubscriptionsDelete });
          }
        }
        else
        {
          console.log("thats 0")
          var movies1 = await moviesBl.getAllMoviesFromWeb()
          //add movies to the json for the selection list
          res.render('AllMembers', {members, movies: movies1.data, moviesList: req.session.memberMoviesArray, subscriptions, user: req.params.user, haveSubscriptionsUpdate, haveSubscriptionsDelete});
        }
    }
    else
    {
      subscriptions = []
      
    }
    
  }
});


router.get('/addMember/:user',async function(req, res, next) {
  let user = req.params.user
  let haveSubscriptionsCreate = false
  if(user!= "Carmel785@gmail.com")
  {
  let users = await usersBl.getAllUserDetails()
  let currentUser =  users.filter(u => u.userName == user)
  console.log(currentUser)
    currentUser.forEach(x=> {
      haveSubscriptionsCreate  = x.permissions.some(p=> p == "Create Subscriptions")
    })
  }
  else
  {
    haveSubscriptionsCreate = true
  }
  res.render('AddMember', {user, haveSubscriptionsCreate});
});

router.get('/addMemberToDB/:user', function(req, res, next) {
  let name = req.query.name
  let email = req.query.email
  let city = req.query.city
  res.redirect('http://localhost:8000/updateMember/'+name+'/'+email+'/'+city+'/'+req.params.user)
});

router.get('/editMember/:name/:user', function(req, res, next) {
  let name = req.params.name
  let user= req.params.user
  res.render('EditMembers', {name,user});
});

router.get('/editMemberUpdate/:preName', function(req, res, next) {
  let name = req.query.name
  let email = req.query.email
  let city = req.query.city
  let preName = req.params.preName
  let user =  req.params.user
  res.redirect('http://localhost:8000/updateMember/'+name+'/'+email+'/'+city+'/'+preName+'/'+user)
});

router.get('/deleteMember/:name/:user', function(req, res, next) {
  let name = req.params.name
  res.redirect('http://localhost:8000/deleteMember/'+name+'/'+user)
  // res.render('EditMembers', {name});
});

router.get('/subscribe/:memberId/:user', function(req, res, next) {
    var movieName = req.query.movies
    var date = req.query.date
    var memberId = req.params.memberId
    var user = req.params.user
    res.redirect('http://localhost:8000/addSubscriptions/'+movieName+'/'+date+'/'+memberId+'/'+user)
});

//redirected from the movie link tje member watchrd, those are the movie details
router.get('/chosenMovie/:name/:genres/*', function(req, res, next) {
  var url = req.params[0];
  res.render('chosenMovie', { name : req.params.name, genres: req.params.genres, pic: url})
});



module.exports = router;
