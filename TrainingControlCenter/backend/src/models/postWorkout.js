import mongoose from 'mongoose';

const postSchema = mongoose.Schema({
    title: String,
    description: String,
    athlete: String,
    tags: [String],
    selectedFile: String,
    createdAt: {
        type: Date,
        default: new Date(),
    },
})

var PostWorkout = mongoose.model('PostWorkout', postSchema);

export default PostWorkout;