import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import authUser from "./routes/user/authUser.js"
import userRoute from './routes/user/userRoutes.js'
import connectCloudinary from "./config/cloudinary.js";
const app = express();
dotenv.config();

connectCloudinary();


app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cookieParser())
app.get('/',(req,res)=>{
  res.json({message:"backend is running"})
})

app.use('/userAuth',authUser)
app.use('/user',userRoute)

mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => {
    console.log("MongoDB connected");
  })
  .catch((error) => {
    console.log(error);
  });

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`server is running on port ${port}`);
});
