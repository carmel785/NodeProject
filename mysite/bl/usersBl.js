var usersDal = require('../dals/usersDal')
var permissionsDal = require('../dals/permissionsDal')
var User = require('../modelsDB/usersModel')

exports.addUserToJson = async function(fname,lname,sessionTimeOut)
{
    return new Promise(async function(resolve, reject)
    {
        var today = new Date();
        var dd = today.getDate();
        var mm = today.getMonth()+1; 
        var yyyy = today.getFullYear();
        var users = await usersDal.readFile()
        if(users  == "empty")
        {
            var obj = [{
                id : 0,
                firstName: fname,
                lastName: lname,
                created_date: dd+"/"+mm+"/"+yyyy,
                duration: sessionTimeOut
            }]
            await usersDal.writeFile(obj)
            resolve("added to json")
        }
        else
        {
            var newId = users.length
            if(newId == 1)
                {
                    newId = 1
                }
            else
            {
                newId = users.length
            }
            var obj = {
                id : newId,
                firstName: fname,
                lastName: lname,
                created_date: dd+"/"+mm+"/"+yyyy,
                duration: sessionTimeOut
            }
            users.push(obj)
            await usersDal.writeFile(users)
            resolve("added to json")
        }
        console.log(users)
    })
}

exports.addPermissionsToJson = async function(data)
{
    return new Promise(async function(resolve, reject)
    {
        var permissionsArry =  makePremissionsText(data)
        var users = await permissionsDal.readFile()
        if(users  == "empty")
        {
            var obj = [{
                id : 0,
                user : data.user,
                permissions : permissionsArry
            }]
            await permissionsDal.writeFile(obj)
            resolve("added to json")
        }
        else
        {
            var newId = users.length
            if(newId == 1)
                {
                    newId = 1
                }
            else
            {
                newId = users.length
            }
            var obj = {
                id : newId,
                user : data.user,
                permissions : permissionsArry

                //data.ViewS, data.createS, data.deleteS, 
                //data.updateS, data.viewM, data.createM, data.deleteM, data.updateM
            }
            users.push(obj)
            await permissionsDal.writeFile(users)
            resolve("added to json")
        }
        // console.log(users)
        
    })
}

exports.addUserToDB = async function(user)
{
    return new Promise(async function(resolve,reject)
    {
        const u = new User({
            User : user,
            Password : ""
        })
        u.save(function(err)
        {
            if(err)
            {
                reject(err)
            }
            else
            {
                resolve("created")
            }
        })
    })
}

//making premissions array from all the data it get 
function makePremissionsText(data)
{
    var arr = []
    if(data.ViewS == "on")
    {
        arr.push("View Subscriptions")
    }
    if(data.createS == "on")
    {
       arr.push("Create Subscriptions")
    }
    if(data.deleteS == "on")
    {
        arr.push("Delete Subscriptions")
    }
    if(data.updateS == "on")
    {
        arr.push("Update Subscription")
    }
    if(data.viewM == "on")
    {
        arr.push("View Movies")
    }
    if(data.createM == "on")
    {
        arr.push("Create Movies")
    }
    if(data.deleteM == "on")
    {
        arr.push("Delete Movies")
    }
    if(data.updateM == "on")
    {
        arr.push("Update Movie")
    }
    // var arr = [viewS,createS,deleteS,updateS, viewM, createM, deleteM, updateM]
    return arr
}

exports.getAllUserDetails = async function()
{
    return new Promise (async function(resolve,reject)
    {
        var user = await usersDal.readFile()
        var permission = await permissionsDal.readFile()
        var details = []
        if(user!= "empty" && permission!= "empty")
        {
            for(let i = 0; i<= user.length-1; i++)
            {
                // console.log(user[i].firstName+ " "+ user[i].lastName)
                // console.log(permission[i].user)
                details.push({
                    fullName : user[i].firstName+ " "+ user[i].lastName,
                    userName : permission[i].user,
                    sessionTimeOut : user[i].duration,
                    created_date : user[i].created_date,
                    permissions : permission[i].permissions
                })
            }
        }
       
        // console.log(details)
        resolve(details)
    })
    
}

exports.deleteUser = async function(user)
{
    return new Promise(async function(resolve,reject)
    {
        User.findOneAndDelete({User: user}, function(err)
        {
            if(err)
            {
                reject(err)
            }
            else
            {
                resolve("deleted")
            }
        })

        var users = await usersDal.readFile()
        var pers = await permissionsDal.readFile()
        let userID = pers.findIndex(x=> 
            {
                if(user == x.User)
                {
                    return x.id
                }
            })
        pers.splice(userID,1)
        users.splice(userID,1)
        await usersDal.writeFile(users)
        await permissionsDal.writeFile(pers)
    })
}

exports.updateUser = async function(data, user)
{
    var permissionsArry =  makePremissionsText(data)
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth()+1; 
    var yyyy = today.getFullYear();

    //update DB
    User.update({User: user},{User: data.user},(err,u)=>
    {
       if(err)
       {
           reject(err)
       }
    })

    
    //update Permissions json
    let permissions = await permissionsDal.readFile()
    let indexP = permissions.findIndex(p=>p.user == user)
    if(indexP>=0)
    {
        permissions[indexP] = {
            id: indexP,
            user: data.user,
            permissions: permissionsArry
        }
        
        await permissionsDal.writeFile(permissions)
    }

    // //update Users json
    let users = await usersDal.readFile()
    if(indexP>=0)
    {
        users[indexP] = {
            id: indexP,
            firstName: data.fname,
            lastName: data.lname,
            created_date: dd+"/"+mm+"/"+yyyy,
            duration: data.sessionTimeOut
        }
        await usersDal.writeFile(users)
    }

}