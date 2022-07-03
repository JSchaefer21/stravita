const { model } = require('mongoose')
const { user, activity, point, comment } = require('./schemas') 

const User = model('User', user)
const Activity = model('Activity', activity)
const Point = model('Point', point)
const Comment = model('Comment', comment)


module.exports = {
    User,
    Activity,
    Point,
    Comment
}