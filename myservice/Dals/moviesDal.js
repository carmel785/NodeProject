const axios = require('axios')
const { addAllMovies } = require('../BL/membersBL')

exports.getAllMovies = async function()
{
    var movies = await axios.get('https://api.tvmaze.com/shows')
    return movies.data
}

