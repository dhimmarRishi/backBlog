const mongoose = require('mongoose')

const CONNECTION_STRING = "mongodb://localhost:27017/Blog"
// const CONNECTION_STRING = "mongodb+srv://dhimmarpankaj1976:0tRo0YN0zuqsdYUB@cluster0.s3xi4sm.mongodb.net/BlogApp?retryWrites=true&w=majority&appName=Cluster0"


mongoose.connect(CONNECTION_STRING).then(() => {
    console.log('Connected to database')
}).catch((e) => {
    console.log(e)
})