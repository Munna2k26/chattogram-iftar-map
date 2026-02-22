import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Admin from "../models/Admin.js";
import Location from "../models/Location.js";
import auth from "../middleware/auth.js";

const router = express.Router();

// Login
router.post("/login", async(req,res)=>{
  const {email,password} = req.body;

  const admin = await Admin.findOne({email});
  if(!admin) return res.status(400).json({message:"Admin not found"});

  const valid = await bcrypt.compare(password,admin.password);
  if(!valid) return res.status(400).json({message:"Wrong password"});

  const token = jwt.sign({id:admin._id},process.env.JWT_SECRET,{expiresIn:"7d"});
  res.json({token});
});

// Pending
router.get("/pending",auth,async(req,res)=>{
  const data = await Location.find({status:"pending"});
  res.json(data);
});

// Approve (24h expire)
router.put("/approve/:id",auth,async(req,res)=>{
  const expireTime = new Date();
  expireTime.setDate(expireTime.getDate()+1);

  await Location.findByIdAndUpdate(req.params.id,{
    status:"approved",
    expireAt: expireTime
  });

  res.json({message:"Approved for 24 hours"});
});

// Delete
router.delete("/delete/:id",auth,async(req,res)=>{
  await Location.findByIdAndDelete(req.params.id);
  res.json({message:"Deleted"});
});

export default router;
