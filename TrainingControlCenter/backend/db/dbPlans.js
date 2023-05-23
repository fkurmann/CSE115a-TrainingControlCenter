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

// Goal collection functions

// Create new goal
exports.createPlan = async (username) => {
  // Credentials into object
  const planSkeleton = {
    username: username,
  }

  // Access database
  try {
    await client.connect();
    await client.db('TCC').collection('plans').insertOne(planSkeleton);
    console.log(`New plan created: ${result.insertedId}`);
    await client.close();
    return 0;
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}

// Find plan, no user existence check
exports.findPlan = async (username) => {

  // Access database
  try {
    await client.connect();
    const result = await client.db('TCC').collection('users').findOne(credentials);
    if (result) {
      console.log(`Found a user with the credentials '${credentials}':`);
      console.log(result);
      await client.close();
      return result;
    } else {
      console.log(`No user found with credentials '${credentials}'`);
      await client.close();
      return -1;
    }
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}

// Collections = tables, documents = rows
