var moviesDal = require('../dals/moviesDal')

exports.getAllMoviesFromWeb = async function()
{
    return await moviesDal.getMovies()
}
