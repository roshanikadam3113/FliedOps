const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const mongoUrl = process.env.MONGO_URL || "mongodb://127.0.0.1:27017/fieldops";
    const conn = await mongoose.connect(mongoUrl);
    console.log(`MongoDB Connected: ${conn.connection.host}`);

    // Drop legacy 'roll_1' index if it exists on the users collection
    try {
      const collections = await conn.connection.db.listCollections({ name: 'users' }).toArray();
      if (collections.length > 0) {
        const usersCollection = conn.connection.db.collection('users');
        const indexes = await usersCollection.indexes();
        const hasRollIndex = indexes.some(idx => idx.name === 'roll_1');
        if (hasRollIndex) {
          await usersCollection.dropIndex('roll_1');
          console.log('Successfully dropped legacy unique index "roll_1" from users collection.');
        }
      }
    } catch (indexError) {
      console.warn(`Could not check or drop legacy indexes: ${indexError.message}`);
    }
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    process.exit(1); // Exit process with failure
  }
};

module.exports = connectDB;