const express = require('express')
const router = express.Router()
const membersBL = require('../BL/membersBL')
const moviesBL = require('../BL/moviesBL')
const subscriptionBL = require('../BL/subscriptionBL')

//starting the web service - collecting all the data to each collection
router.route('/').get(async function(req,res)
{
    //check if the collection with data, if not he creating the database
    var MembersData = await membersBL.getAllMembers()
    if(MembersData == "")
    {
        await membersBL.addAllMembers()
        res.send("created !")
    }

    var moviesData = await moviesBL.getAllMovies()
    if(moviesData == "")
    {
        await moviesBL.addAllMovies()
        res.send("created !")
    }
    res.send("Web service is on !")
})

//add movie th data base. this route is redirected from webService - movieRouter
router.route('/addMovie/:name/:genres/:image/:premiered').get(async function(req,res)
{
    let name = req.params.name
    let genres = req.params.genres
    let image = req.params.image
    let premiered = req.params.premiered

    let movie ={
        name: name,
        genres: genres,
        image: image,
        premiered: premiered
    }

    await moviesBL.addMovieToDB(movie)
    res.redirect('http://localhost:3000/moviesRouter')
})

//add movie th data base. this route is redirected from webService - movieRouter
router.route('/editMovie/:preMovie/:name/:genres/:image/:premiered').get(async function(req,res)
{
    let name = req.params.name
    let genres = req.params.genres
    let image = req.params.image
    let premiered = req.params.premiered
    let preMovie = req.params.preMovie

    let movie ={
        name: name,
        genres: genres,
        image: image,
        premiered: premiered
    }

    await moviesBL.editMovieInDB(movie,preMovie)
    res.redirect('http://localhost:3000/moviesRouter')
})

//get Members and Subscriptions
router.route('/getMembersAndSubscriptions/:user').get(async function(req,res)
{
    var membersData = await membersBL.getAllMembers()
    var members = JSON.stringify(membersData)
    var user = req.params.user

    var response = true
    
    var subscriptionsData = await subscriptionBL.getSubscription()
    // subscriptionsData.forEach(element => {
    //     element.Movies.forEach(m=>{
    //         console.log(m.movieName)
    //     })
    // });
    // res.send(subscriptionsData)

    var subscriptions = JSON.stringify(subscriptionsData)

    res.redirect('http://localhost:3000/membersRouter/allMembers/'+response+'/'+members+'/0'+'/'+subscriptions+'/'+user)
})

//add subscriptions
router.route('/addSubscriptions/:movieName/:date/:memberId/:user').get(async function(req,res)
{
    var movieName = req.params.movieName
    var date = req.params.date
    var memberId = req.params.memberId
    var user = req.params.user
    await subscriptionBL.addSubscription(movieName,date,memberId)
    res.redirect('/getMembersAndSubscriptions/'+user)
})

//update members
router.route('/updateMember/:name/:email/:city/:preName/:user').get(async function(req,res)
{
    let name = req.params.name
    let email = req.params.email
    let city = req.params.city
    let preName = req.params.preName
    await membersBL.editMemberInDB(name,email,city,preName)
    res.redirect('/getMembersAndSubscriptions/'+user)
})

//Add members
router.route('/addMember/:name/:email/:city/:user').get(async function(req,res)
{
    let name = req.params.name
    let email = req.params.email
    let city = req.params.city
    await membersBL.addMember(name,email,city)
    res.redirect('/getMembersAndSubscriptions/'+user)
})

//delete members
router.route('/deleteMember/:name/:user').get(async function(req,res)
{
    let name = req.params.name
    await membersBL.deleteMemberInDB(name)
    res.redirect('/getMembersAndSubscriptions/'+user)
})

module.exports = router