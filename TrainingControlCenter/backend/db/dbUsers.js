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
    favorites: [],
    stravaToken: null
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

// Function to update the Strava token which will expire regularly
exports.updateUser = async (username, token) => {
  // Access database
  try {
    await client.connect();
    const result = await client.db("TCC").collection("users").updateOne({user: username}, { $set: {stravaToken: token}});

    console.log(`User token updated to: ${token}`);
    await client.close();
    return result;
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
  if (password === null) {
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

// Add favorites
exports.addFavorite = async (username, favorite) => {
  // Access database
  try {
    await client.connect();
    const result = await client.db("TCC").collection("users").updateOne({user: username}, { $push: {favorites: favorite} });

    if (result) {
      console.log(`Updated user: ${username}'s favorites ${favorite}':`);
      await client.close();
      return result;
    } else {
      console.log(`Error during updating of favorites`);
      await client.close();
      return -1;
    }
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
// Delete favorites
exports.deleteFavorite = async (username, favorite) => {
  // Access database
  try {
    await client.connect();
    const result = await client.db("TCC").collection("users").updateOne({user: username}, { $pull: {favorites: favorite} });

    if (result) {
      console.log(`Deleted user: ${username}'s favorites ${favorite}':`);
      await client.close();
      return 0;
    } else {
      console.log(`Error during deleting of favorites`);
      await client.close();
      return -1;
    }
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
// Get favorites - Just use findUser function

// Collections = tables, documents = rows
