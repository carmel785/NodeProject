var User = require('../modelsDB/usersModel')

// this function check if the user is in the database,
//return boolean.
exports.findUser = async function(userData)
{
    return new Promise(function( resolve, reject )
    {
        return User.find({User : userData.user , Password : userData.pwd}, function(err,u)
        {
            if(u == "")
            {
                console.log("in!")
                return User.update({Password: ""}, { Password : userData.pwd}
                , function(err)
                 {
                     if(err)
                     {
                         reject(err)
                     }
                     else
                     {
                         resolve('Updated!')
                     }
                 })
            }
               
            if(err)
            {
                reject(err)
            }
            else if( u == "")
            {
                resolve(false)
            }
            else
            {
                resolve(true)
            }
        })
    })
   
}