const Subscription = require('../modelsDB/subscriptionsModel')
var subscriptionsDal = require('../Dals/subscriptionDal')

//Get all Subscriptions
exports.getSubscription = function()
{
    return subscriptionsDal.getAllSubscriptions()
}

exports.addSubscription = function(movieName,date,memberId)
{
    return new Promise(async function(resolve,reject)
    {
        var allSubscriptions = await subscriptionsDal.getAllSubscriptions()
        var index = allSubscriptions.findIndex(x=> x.MemberId == memberId)
       
        if(index>= 0)
        {
            var movies = allSubscriptions[index].Movies
            let moviesArr = {Movies:[...movies,{movieName,date}]}
            let moveisOfUser = moviesArr.Movies.map(x=> x)

            Subscription.update({MemberId : memberId},{Movies : moveisOfUser},(err,u)=>
            {
                if(err)
                {
                    reject(err)
                }
                else
                {
                    resolve('updated')
                }
            })
                // allSubscriptions.forEach(x=> console.log(x))
        }
        else
        {
            const s = new Subscription({
                MemberId : memberId,
                Movies : {movieName, date}
            })
        
            s.save(function(err)
            {
                if(err)
                {
                    reject(err)
                }
                else
                {
                    resolve('created')
                }
            })
        }

        
    })
    
}
