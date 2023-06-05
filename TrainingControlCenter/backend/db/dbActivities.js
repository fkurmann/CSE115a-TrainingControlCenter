const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://fkurmann:tcc@tcc.zfhwc4p.mongodb.net/?retryWrites=true&w=majority";

// Activitiy collection functions

// Add activity to database
exports.createActivity = async (username, name, type, sport, description, json) => {
  // Credentials into object
  const activitySkeleton = {
    username: username,
    name: name,
    type: type,
    sport: sport,
    description: description,
    start_date_local: json.start_date_local,
    distance: json.distance,
    moving_time: json.moving_time,
    json: json,
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
  let parameters = {};

  const variables = ['username', 'name', 'sport', 'type'];
  for (const[idx, item] of [username, name, sport, type].entries()) {
    if (item != undefined) {
      parameters[variables[idx]] = item;
    }
  }
  if ((minDuration != undefined) && (maxDuration != undefined)) {
    parameters['json.moving_time'] = {$gte: minDuration, $lte: maxDuration};
  } else if ((minDuration == undefined) && (maxDuration != undefined)) {
    parameters['json.moving_time'] = {$lte: maxDuration};
  } else if ((minDuration != undefined) && (maxDuration == undefined)) {
    parameters['json.moving_time'] = {$gte: minDuration};
  }

  if ((minDistance != undefined) && (maxDistance != undefined)) {
    parameters['json.distance'] = {$gte: minDistance, $lte: maxDistance};
  } else if ((minDistance == undefined) && (maxDistance != undefined)) {
    parameters['json.distance'] = {$lte: maxDistance};
  } else if ((minDistance != undefined) && (maxDistance == undefined)) {
    parameters['json.distance'] = {$gte: minDistance};
  }

  if (minDate != undefined) {
    if (isNaN(Date.parse(minDate))) {
      console.error(`Invalid date format '${minDate}'`);
      return -1;
    }
  }
  if (maxDate != undefined) {
    if (isNaN(Date.parse(maxDate))) {
      console.error(`Invalid date format '${maxDate}'`);
      return -1;
    }
  }

  if ((minDate != undefined) && (maxDate != undefined)) {
    parameters['json.start_date_local'] = {$gte: new Date(minDate).toISOString(), $lte: new Date(maxDate).toISOString()};
  } else if ((minDate == undefined) && (maxDate != undefined)) {
    parameters['json.start_date_local'] = {$lte: new Date(maxDate).toISOString()};
  } else if ((minDate != undefined) && (maxDate == undefined)) {
    parameters['json.start_date_local'] = {$gte: new Date(minDate).toISOString()};
  }

  console.log(`Parameters: ${JSON.stringify(parameters)}`);
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
    const result = await client.db('TCC').collection('activities').find(parameters);
    if (result) {
      let returnList = await result.toArray();
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
    name: name,
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
