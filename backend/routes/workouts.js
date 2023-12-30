const express = require("express")
const {
    getAllWorkouts, createWorkout,  deleteWorkout
    } = require('../controllers/workoutController')

const requireAuth = require('../middleware/requireAuth')
const router = express.Router()

//Ensuring authentication before processing requests
router.use(requireAuth)

/**
 * Workout routes, '/api/workouts/'
 */
// GET all workouts
router.get('/',getAllWorkouts)

// POST a new workout
router.post('/', createWorkout)

// DELETE a workout
router.delete('/:id', deleteWorkout)

module.exports = router