const { MongoClient, ServerApiVersion } = require('mongodb');

const uri = "mongodb+srv://fkurmann:tcc@tcc.zfhwc4p.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function connectToDatabase() {
  try {
    await client.connect();
    console.log('Connected to database');
  } catch (error) {
    console.error(error);
  }
}

async function addWorkout(username, name, type, sport, distance, time) {
  try {
    const database = client.db('TCC');
    const workoutsCollection = database.collection('workouts');
    const newWorkout = { username, name, type, sport, distance, time };
    const result = await workoutsCollection.insertOne(newWorkout);
    console.log(`Added workout with ID ${result.insertedId}`);
    return result.insertedId;
  } catch (error) {
    console.error(error);
    return -1;
  }
}

module.exports = { connectToDatabase, addWorkout };
