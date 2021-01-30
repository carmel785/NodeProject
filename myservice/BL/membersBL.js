const Member = require('../modelsDB/membersModel')
var membersDal = require('../Dals/membersDal')

exports.addAllMembers = async function()
{
    return new Promise(async function(resolve, reject)
    {
        var members = await membersDal.getAllMembers()
        members.forEach( membersDB => 
        {
            const m = new Member({
            Name : membersDB.name,
            Email : membersDB.email,
            City : membersDB.address.city
            })
    
            m.save(function(err)
            {
                if(err)
                {
                    reject(err)
                }
                else
                {
                    resolve('created !')
                }
            })
        })
    })
}

exports.getAllMembers = function()
{
    return new Promise((resolve,reject) =>
    {
        Member.find(({}), function(err,mems)
        {
            if(err)
            {
                reject(err)
            }
            else
            {
                resolve(mems)
            }           
        })
    })
    
}
//Edit Member
exports.editMemberInDB = function(memberName,email,city,preName)
{
    return new Promise(function(resolve,reject)
    {
        Member.update({Name: preName}
            ,{
                Name: memberName,
                Email: email,
                City: city
             },function(err,m)
                {
                    if(err)
                    {
                        reject(err)
                    }
                    else
                    {
                        resolve(m)
                    }
                })
    })
}
//Delete Member
exports.deleteMemberInDB = function(memberName)
{
    return new Promise(function(resolve,reject)
    {
        Member.findOneAndDelete({Name: memberName}
            ,function(err)
                {
                    if(err)
                    {
                        reject(err)
                    }
                    else
                    {
                        resolve("Deleted")
                    }
                })
    })
}

exports.addMember = async function(name,email,city)
{
    return new Promise(async function(resolve, reject)
    {
        const m = new Member({
        Name : name,
        Email : email,
        City : city
        })
    
        m.save(function(err)
        {
            if(err)
            {
                reject(err)
            }
            else
            {
                resolve('created !')
            }
        })
       
    })
}