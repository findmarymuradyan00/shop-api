import mongoose from 'mongoose';

export async function connectDB(){
  const MONGO_URI = process.env.MONGO_URI;

  if(!MONGO_URI){
    throw new Error('failed to connect to db, no db uri provided');
  }

  try{
    await mongoose.connect(MONGO_URI);
    console.log('Successfully connected to DB')
  }catch(err){
    console.log(`failed to connect to db`);
    process.exit(1);
  }
}