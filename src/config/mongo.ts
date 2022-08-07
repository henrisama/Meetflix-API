import mongoose from "mongoose";

mongoose.Promise = global.Promise;
mongoose
  .connect(process.env.MONGO_URI as string)
  .catch((error: any) => console.log(error));
