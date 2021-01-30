var jsonfile = require('jsonfile')

exports.writeFile = function(data)
{
    jsonfile.writeFile("jsonFiles/Permissions.json" ,data, (err)=>
    {
        if(err)
        {
            console.log(err)
        }
        else
        {
            console.log("new permissions created")
        }    
    })
}

exports.readFile = function()
{
    return new Promise(function(resolve,reject) {
        jsonfile.readFile("jsonFiles/Permissions.json", function(err,data)
        {
            if(err)
            {
                if(data == undefined)
                {
                    resolve("empty")
                }
                else
                {
                    reject(err)
                }
            }
            else
            {
                resolve(data)
            }    
        })
    })
    
}