const Subscription = require('../modelsDB/subscriptionsModel')

exports.getAllSubscriptions = async function()
{
    return new Promise((resolve,reject) =>
    {
        Subscription.find(({}), function(err,subs)
        {
            if(err)
            {
                reject(err)
            }
            else
            {
                resolve(subs)
            }           
        })
    })
}