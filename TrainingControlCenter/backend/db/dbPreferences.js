const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://fkurmann:tcc@tcc.zfhwc4p.mongodb.net/?retryWrites=true&w=majority";

// Preference collection functions

// Update user's preferences. Second argument might be {isMetric: false, colorTheme: 'orange'}
exports.updatePreferences = async (username, updatedPreferences) => {
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
    const result = await client.db('TCC').collection('preferences').updateOne({username: username}, { $set: updatedPreferences});
    console.log(`Updated preferences: ${updatedPreferences}`);
    await client.close();
    return result;
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}

// Find preferences by username
exports.findPreferences = async (username) => {
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
    const result = await client.db('TCC').collection('preferences').findOne({username: username});
    if (result) {
      console.log(`Found preferences for user '${username}':`);
      await client.close();
      return result;
    } else {
      console.log(`No preferences found for user '${username}'`);
      await client.db('TCC').collection('preferences').insertOne({username: username});
      await client.close();
      return {username: username};
    }
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
