const axios = require('axios')

exports.getAllMembers = async function()
{
    var members = await axios.get('https://jsonplaceholder.typicode.com/users')
    return members.data
}


