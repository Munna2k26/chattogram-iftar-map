import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

import locationRoutes from "./routes/locationRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static("public"));

app.use("/api/locations", locationRoutes);
app.use("/api/admin", adminRoutes);

mongoose.connect(process.env.MONGO_URI)
.then(()=>console.log("Mongo Connected"))
.catch(err=>console.log(err));

const PORT = process.env.PORT || 5000;
app.listen(PORT,()=>console.log("Server Running"));
