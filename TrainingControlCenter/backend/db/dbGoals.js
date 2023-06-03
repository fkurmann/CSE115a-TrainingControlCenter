const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://fkurmann:tcc@tcc.zfhwc4p.mongodb.net/?retryWrites=true&w=majority";

// Goal collection functions

// Create new goal
exports.createGoal = async (username, name, type, sport, distance, time) => {
  // Credentials into object
  const goalSkeleton = {
    username: username,
    name: name,
    type: type,
    sport: sport,
    distance: distance,
    time: time,
  }
  const client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    }
  });

  // Access database
  try {
    await client.connect();
    await client.db('TCC').collection('goals').insertOne(goalSkeleton);
    console.log(`New goal created: ${goalSkeleton}`);
    await client.close();
    return 0;
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}

// Find goal, no user existence check, can find by username, name, type, sport
exports.findGoal = async (username, name, type, sport) => {
  let parameters = {
    username: username,
  }
  // Find by name
  if (name != null) {
    parameters.name = name;
  }
  // Find by type
  if (type != null) {
    parameters.type = type;
  }
  // Find by sport
  if (sport != null) {
    parameters.sport = sport;
  }
  const client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    }
  });

  // Access database
  try {
    await client.connect();
    const result = await client.db('TCC').collection('goals').find(parameters);
    if (result) {
      const returnList = await result.toArray();
      console.log(`Found goals with the parameters '${parameters}':`);
      await client.close();
      return returnList;
    } else {
      console.log(`No goal found with parameters '${parameters}'`);
      await client.close();
      return -1;
    }
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}

// Delete goals (must be done by name)
exports.deleteGoal = async (username, name) => {
  const parameters = {
    username: username,
    name: name
  }
  const client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    }
  });

  // Access database
  try {
    await client.connect();
    const result = await client.db('TCC').collection('goals').deleteOne(parameters);
    if (result) {
      console.log(`Deleted user: ${username}'s goal ${name}':`);
      await client.close();
      return 0;
    } else {
      console.log(`Error during deleting of goal`);
      await client.close();
      return -1;
    }
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}

// Collections = tables, documents = rows
