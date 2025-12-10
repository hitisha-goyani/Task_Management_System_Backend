

import dotenv from "dotenv";
dotenv.config();
import express from "express"
import HttpError from "./middleware/ErrorHandler.js";
import connectDB from "./config/db.js";
import userRouter from "./routes/userRoutes.js"
import taskRouter from "./routes/taskRoutes.js"



const app = express();

app.use(express.json());

app.use("/user",userRouter);
app.use("/task",taskRouter);

app.get("/",(req,res)=>{
    res.status(200).json("hello from server");
})
app.use((req,res,next) =>{
    next (new HttpError("requested route not found"));
})


app.use((error,req,res,next)=>{

    if(req.headersSent){
       return next(error);
    }

    res.status(error.statusCode || 500)
    .json(error.message || "something went wrong try again")
})

const port =  5000;

const startServer = async () =>{


    try{
        const connect = await connectDB();

    if(!connect){
        throw new Error("failed to connect db")
    }

    console.log("db connected");

    app.listen(port,() =>{
    console.log("server running on port",port)
    })

}catch(error){
    console.log(error.message);
    process.exit(1);
};

}


startServer()