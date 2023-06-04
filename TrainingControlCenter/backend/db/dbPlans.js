const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://fkurmann:tcc@tcc.zfhwc4p.mongodb.net/?retryWrites=true&w=majority";

// Plans collection functions

// Add planned activity to database
exports.createPlannedActivity = async (username, name, type, sport, description, json) => {
  // Credentials into object
  const plannedActivitySkeleton = {
    username: username,
    name: name,
    type: type,
    sport: sport,
    description: description,
    start_date_local: json.start_date_local,
    distance: json.distance,
    moving_time: json.moving_time,
    kind: "calendar#event",
    summary: name,
    start: {dateTime: json.start_date_local, timeZone: "UTC"},
    end: {dateTime: json.end_date_local, timeZone: "UTC"},
    eventType: "default",
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
    await client.db('TCC').collection('plans').insertOne(plannedActivitySkeleton);
    console.log(`New planned activity created: ${plannedActivitySkeleton}`);
    await client.close();
    return 0;
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}

// Find activity
exports.findPlannedActivity = async (username, name, sport, type, minDuration, maxDuration, minDistance, maxDistance, minDate, maxDate) => {
  let parameters = {};

  const variables = ['username', 'name', 'sport', 'type'];
  for (const[idx, item] of [username, name, sport, type].entries()) {
    if (item != undefined) {
      parameters[variables[idx]] = item;
    }
  }
  if ((minDuration != undefined) && (maxDuration != undefined)) {
    parameters['moving_time'] = {$gte: minDuration, $lte: maxDuration};
  } else if ((minDuration == undefined) && (maxDuration != undefined)) {
    parameters['moving_time'] = {$lte: maxDuration};
  } else if ((minDuration != undefined) && (maxDuration == undefined)) {
    parameters['moving_time'] = {$gte: minDuration};
  }

  if ((minDistance != undefined) && (maxDistance != undefined)) {
    parameters['distance'] = {$gte: minDistance, $lte: maxDistance};
  } else if ((minDistance == undefined) && (maxDistance != undefined)) {
    parameters['distance'] = {$lte: maxDistance};
  } else if ((minDistance != undefined) && (maxDistance == undefined)) {
    parameters['distance'] = {$gte: minDistance};
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
    parameters['start_date_local'] = {$gte: new Date(minDate).toISOString(), $lte: new Date(maxDate).toISOString()};
  } else if ((minDate == undefined) && (maxDate != undefined)) {
    parameters['start_date_local'] = {$lte: new Date(maxDate).toISOString()};
  } else if ((minDate != undefined) && (maxDate == undefined)) {
    parameters['start_date_local'] = {$gte: new Date(minDate).toISOString()};
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
    const result = await client.db('TCC').collection('plans').find(parameters);
    if (result) {
      let returnList = await result.toArray();
      console.log(`Found planned activities with the parameters '${parameters}':`);
      await client.close();
      return returnList;
    } else {
      console.log(`No planned activity found with parameters '${parameters}'`);
      await client.close();
      return -1;
    }
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}

// Delete activity (must be done by name)
exports.deletePlannedActivity = async (username, name) => {
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
    const result = await client.db("TCC").collection("plans").deleteOne(parameters);
    if (result) {
      console.log(`Deleted user: ${username}'s planned activity ${name}':`);
      await client.close();
      return 0;
    } else {
      console.log(`Error during deleting of planned activity`);
      await client.close();
      return -1;
    }
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}

// Delete planned activity (must be done by name)
exports.clearPlannedActivities = async (username) => {
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
    const result = await client.db("TCC").collection("plans").deleteMany(parameters);
    if (result) {
      console.log(`Deleted all user: ${username}'s planned activities`);
      await client.close();
      return 0;
    } else {
      console.log(`Error during deleting of planned activities`);
      await client.close();
      return -1;
    }
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
