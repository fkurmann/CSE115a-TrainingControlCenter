const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://fkurmann:tcc@tcc.zfhwc4p.mongodb.net/?retryWrites=true&w=majority";

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

// Add or delete multiple favorites
exports.updateFavorites = async (username, add_favorites, delete_favorites) => {
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
    let result = 0;
    if (add_favorites && add_favorites.length > 0) {
      result = await client.db("TCC").collection("users").updateOne({user: username}, { $addToSet: {favorites: {$each: add_favorites} } });
      if (!result) {
        console.log(`Error during updating of favorites`);
        await client.close();
        return -1;
      }
    }
    if (delete_favorites && delete_favorites.length > 0) {
      result = await client.db("TCC").collection("users").updateOne({user: username}, { $pullAll: {favorites: delete_favorites} });
      if (!result) {
        console.log(`Error during deleting of favorites`);
        await client.close();
        return -1;
      }
    }
    await client.close();
    return result;

  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
// Get favorites - Just use findUser function

// Collections = tables, documents = rows
