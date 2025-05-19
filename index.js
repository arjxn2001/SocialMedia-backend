

import express from "express";
import cors from "cors";
import userRouter from "./routes/user.route.js"
import pinRouter from "./routes/pin.route.js"
import commentRouter from "./routes/comment.route.js"
import boardRouter from "./routes/board.route.js"
import connectDB from "./utilities/connectDB.js";
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";


const app = express();

app.use(express.json())

app.use(cors({
  origin: (origin, callback) => {
    const allowedOrigins = [
      "http://localhost:5173",
      "http://localhost:5174",
      "https://socialmedia-frontend-mocha.vercel.app",
    ];
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.warn("Blocked by CORS:", origin);
      callback(null, false); // safer than throwing error
    }
  },
  credentials: true,
}));



app.use(cookieParser());
app.use(fileUpload());


app.use("/users", userRouter)
app.use("/pins", pinRouter)
app.use("/comments", commentRouter)
app.use("/board", boardRouter)



// app.use("/test", (req,res)=>{
//     return res.json("Hello from backend api")
// })

app.listen(3000,()=>{
    connectDB()
    console.log("Server is running!");
});