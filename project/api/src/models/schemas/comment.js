const { Schema } = require('mongoose')
const { Types: { ObjectId }} = Schema


const comment = new Schema({
    user: {
        type: ObjectId,
        ref: 'User'
    },
    text: {
        type: String,
        default: ''
    },
    date: {
        type: Date,
        default: Date.now
    }
})

module.exports = comment