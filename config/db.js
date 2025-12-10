

import mongoose from "mongoose"

const connectDB = async () =>{
    try{

        const connect = mongoose.connect("mongodb://127.0.0.1:27017/task")

        return connect;

    }catch(error){

        throw new Error(error.message);

    }
};


export default connectDB;
