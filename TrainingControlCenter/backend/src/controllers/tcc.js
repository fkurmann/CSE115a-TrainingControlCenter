import PostWorkout from "../models/postWorkout.js";

// All the handlers for the routes
export const getWorkouts = async (req, res) => {
  try {
    const postWorkouts = await PostWorkout.find();
    console.log(postWorkouts);
    res.status(200).json(postWorkouts);
  } catch (error) {
    res.status(404).json({message: error.message});
  }
}

export const createWorkout = async (req, res) => {
  const workout = req.body;
  const newWorkout = new PostWorkout(workout);

  try {
    await newWorkout.save();

    res.status(201).json(newPost);
  } catch (error) {
    res.status(409).json({message: error.message});
  }
}