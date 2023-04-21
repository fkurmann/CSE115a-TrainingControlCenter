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

// User collection functions

// Create new user
exports.createUser = async (username, password) => {
  // Credentials into object
  const credentials = {
    user: username,
    pw: password,
  } 
 
  // Access database
  try {
    await client.connect();
    const result = await client.db('TCC').collection('users').insertOne(credentials);
    console.log(`New user created with the following id: ${result.insertedId}`);
    await client.close();
    return credentials;
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}

// Find user
exports.findUser = async (username, password) => {
  // If BLANK used as password, code to search just username
  let credentials = {
    user: username,
    pw: password,
  } 
  if (password === 'BLANK') {
    credentials = {
      user: username
    }
  }

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