const mongoose = require('mongoose');
const mongoUri = "mongodb://localhost:27017/inotebook"

async function connectToMongo() {
    await mongoose.connect(mongoUri).then(()=> console.log("Connected to Mongo Successfully")).catch(err => console.log(err));
  }
  
  module.exports = connectToMongo;
