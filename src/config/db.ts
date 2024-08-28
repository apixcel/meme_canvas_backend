import mongoose from "mongoose";

const connect = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI as string);
    console.log("Connection Created to Mongodb");
  } catch (error) {
    console.log(error);
  }
};

export default connect;
