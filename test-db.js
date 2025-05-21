const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config();

const uri = process.env.MONGO_URI;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function testConnection() {
  try {
    // Connect the client to the server
    await client.connect();
    
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("✅ Successfully connected to MongoDB!");
    
    // Get database info
    const db = client.db();
    const collections = await db.listCollections().toArray();
    console.log("\n📂 Collections in the database:");
    collections.forEach(col => console.log(`- ${col.name}`));
    
    return true;
  } catch (error) {
    console.error("❌ Error connecting to MongoDB:", error);
    return false;
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}

// Run the test
testConnection().then(success => {
  process.exit(success ? 0 : 1);
});
