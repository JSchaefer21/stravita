
function calculateUserData (activities) {
    
    let data = {}
     
    // total activities
    data.totalActivities = activities.length
    // total altitude (only positive)
    let altitude=0
    activities.forEach(activity=>{
        const n = activity.points[activity.points.length-1].altitude-activity.points[0].altitude
        if (n>0)
        altitude += n
    })
    data.totalAltitude = altitude.toFixed(0)


    // get only last month activities
    const currentDate = new Date()
    const lastMonthDate = currentDate.setMonth(currentDate.getMonth() + 1);
    const lastMonthActivities = activities.filter(activity => {
        return activity.date<lastMonthDate
    })
    
    // total month activities
    data.totalMonthActivities = lastMonthActivities.length
    // total month altitude (only positive)
    altitude=0
    lastMonthActivities.forEach(activity=>{
        const n = activity.points[activity.points.length-1].altitude-activity.points[0].altitude
        if (n>0)
        altitude += n
    })
    data.totalMonthAltitude = altitude.toFixed(0)

    return data
}

export default calculateUserData