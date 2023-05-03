const { MongoClient, ServerApiVersion } = require('mongodb');

const uri = "mongodb+srv://fkurmann:tcc@tcc.zfhwc4p.mongodb.net/?retryWrites=true&w=majority";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

// Activitiy collection functions

// Response to manual entry of activity create activity
exports.createActivity = async (username, name, sport, json) => {
  // Credentials into object
  const activitySkeleton = {
    username: username,
    name: name,
    sport: sport,
    json: json
  }
 
  // Access database
  try {
    await client.connect();
    await client.db('TCC').collection('activities').insertOne(activitySkeleton);
    console.log(`New activity created: ${activitySkeleton}`);
    await client.close();
    return 0;
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}

// Find activity
exports.findActivity = async (username, name, sport, type, minDuration, maxDuration, minDistance, maxDistance, minDate, maxDate) => {
  let parameters = {
  }
  let variablesIndex = 0;
  const variables = ['username', 'name', 'sport', 'type', 'minDuration', 'maxDuration', 'minDistance', 'maxDistance', 'minDate', 'maxDate']
  for (item of [username, name, sport, type, minDuration, maxDuration, minDistance, maxDistance, minDate, maxDate]) {
    if (item != null) {
      parameters[variables[variablesIndex]] = item;
    }
    variablesIndex+=1;
  }

  // Access database
  try {
    await client.connect();
    const result = await client.db('TCC').collection('activities').find(parameters);
    if (result) {
      const returnList = await result.toArray();
      console.log(`Found activities with the parameters '${parameters}':`);
      await client.close();
      return returnList;
    } else {
      console.log(`No activity found with parameters '${parameters}'`);
      await client.close();
      return -1;
    }
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}

// Delete activity (must be done by name)
exports.deleteActivity = async (username, name) => {
  const parameters = {
    username: username,
    name: name
  }
  // Access database
  try {
    await client.connect();
    const result = await client.db("TCC").collection("activities").deleteOne(parameters);
    if (result) {
      console.log(`Deleted user: ${username}'s activity ${name}':`);
      await client.close();
      return 0;
    } else {
      console.log(`Error during deleting of activity`);
      await client.close();
      return -1;
    }
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}

// Delete activity (must be done by name)
exports.clearActivities = async (username) => {
  const parameters = {
    username: username,
  }
  // Access database
  try {
    await client.connect();
    const result = await client.db("TCC").collection("activities").deleteMany(parameters);
    if (result) {
      console.log(`Deleted all user: ${username}'s activities`);
      await client.close();
      return 0;
    } else {
      console.log(`Error during deleting of activities`);
      await client.close();
      return -1;
    }
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
