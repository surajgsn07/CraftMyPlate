import mongoose from "mongoose";
const connectDB  = async ()=>{
    try {
        const connectionInstance = await mongoose.connect(`mongodb+srv://surajgsn07:YMXL4F10CFr8vDZC@cluster0.hnztu.mongodb.net/craftmyplate`);
    
    console.log(`Mongodb connected with host ${connectionInstance.connection.host}`)
    } catch (error) {
        console.log("SRC :: DB :: index.js :: mongodb connection failed " , error);
    }
}

export default connectDB;