import mongoose from "mongoose";

const connectDB = async () => {
    try {
        const connectionString = await mongoose.connect(process.env.MONGO_URL);
        console.log(connectionString.connection.host);
    } catch (error) {
        console.log(error);
        process.exit(1); // this show us failer
    }
}

export default connectDB;