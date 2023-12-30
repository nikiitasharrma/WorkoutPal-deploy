const express = require("express")
const app = express();
require('dotenv').config();
const mongoose = require('mongoose')

const workoutRoutes = require('./routes/workouts')
const user = require('./routes/user')

const path = require('path')

/* 
*  middlewares:
*  express.json() middleware parses incoming JSON payloads 
*  and makes the parsed data available in "req.body".
*  The custom middleware logs information about the 
*  incoming request, such as the path and method and 
*  passes control to the next middleware.
*/
app.use(express.json())
app.use((req,res,next)=>{
    // console.log(req.path, req.method)
    next()
})

/**
 * routes:
 * Mounts the workout routes under the '/api/workouts' endpoint 
 * Mounts the user routes under the '/api/user' endpoint
 */
app.use('/api/workouts',workoutRoutes)
app.use('/api/user', user)

//static files
app.use(express.static(path.join(__dirname, "../frontend/build")))
app.get("*", function(req,res) {
    res.sendFile(path.join(__dirname, "../frontend/build/index.html"))
})

/**
 * Establishing connection to MongoDB Atlas.
 * Upon successful connection, starts the Express 
 * server to listen on port specified in .env file.
 */
mongoose.connect(process.env.MONGO_URI)
.then(()=>{
    app.listen(process.env.PORT,()=>{
        // console.log("listening to port",process.env.PORT)
    })
})
.catch((error)=>{
    // console.log(error)
})

