require('dotenv').config()
const { connect, disconnect } = require('mongoose')
const { Activity, Point, User } = require('./models')
const bcrypt = require('bcryptjs')

;(async () => {
        try {
            await connect(process.env.MONGODB_URL)

            const hash = await bcrypt.hash('12121212', 10)

            const user = await User.create({ name: 'populate', username: 'populate', password: hash, email: 'populate@gmail.com' })


            const p1 = await Point.create({altitude: 259, latitude: 41.3958, longitude: 2.10411})
            const p2 = await Point.create({altitude: 264, latitude: 41.4004, longitude: 2.1044})
            const p3 = await Point.create({altitude: 281, latitude: 41.3957, longitude: 2.1005})
            const p4 = await Point.create({altitude: 280, latitude: 41.3900, longitude: 2.1001})
            const p5 = await Point.create({altitude: 285, latitude: 41.3918, longitude: 2.0987})
            const p6 = await Point.create({altitude: 387, latitude: 41.3935, longitude: 2.0980})
            const p7 = await Point.create({altitude: 336, latitude: 41.3964, longitude: 2.0990})
            const p8 = await Point.create({altitude: 356, latitude: 41.4000, longitude: 2.1013})
            const p9 = await Point.create({altitude: 351, latitude: 41.4033, longitude: 2.1041})
            const p10 = await Point.create({altitude: 360, latitude: 41.4050, longitude: 2.1054})

            let activity = new Activity({user: user.id, title: 'populate activity', sport: 'Ride' })
            activity.points.push(p1)
            activity.points.push(p2)
            activity.points.push(p3)
            activity.points.push(p4)
            activity.points.push(p5)
            activity.points.push(p6)
            activity.points.push(p7)
            activity.points.push(p8)
            activity.points.push(p9)
            activity.points.push(p10)

            await activity.save()

            await disconnect()
        } catch (error) {
            console.error(error)
        }
    })()