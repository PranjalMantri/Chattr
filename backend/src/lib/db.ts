import mongoose from "mongoose";

export const connectDB = async (): Promise<void> => {
  try {
    const mongdb_uri = process.env.MONGODB_URI;

    if (!mongdb_uri) {
      console.log("Could not find database connection string");
      return;
    }

    await mongoose.connect(mongdb_uri);
    console.log(`Connected to database successfuly`);
  } catch (error: any) {
    console.log(
      "Something went wrong while connecting to the database: ",
      error
    );
  }
};
