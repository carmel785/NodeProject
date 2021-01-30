var jsonfile = require('jsonfile')
var axios = require('axios')

exports.getMovies = function() {
    return axios.get('https://api.tvmaze.com/shows')
}
