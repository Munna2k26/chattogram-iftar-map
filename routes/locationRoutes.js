import express from "express";
import Location from "../models/Location.js";

const router = express.Router();

// Submit
router.post("/", async (req,res)=>{
  const location = new Location(req.body);
  await location.save();
  res.json({message:"Submitted for approval"});
});

// Get approved + not expired + search
router.get("/", async (req,res)=>{
  const { search } = req.query;

  let filter = {
    status:"approved",
    expireAt: { $gt: new Date() }
  };

  if(search){
    filter.$or = [
      { title: { $regex: search, $options:"i"} },
      { area: { $regex: search, $options:"i"} }
    ];
  }

  const data = await Location.find(filter);
  res.json(data);
});

// Vote
router.post("/vote/:id", async(req,res)=>{
  const { type } = req.body;
  const ip =
    req.headers["x-forwarded-for"]?.split(",")[0] ||
    req.socket.remoteAddress;

  const location = await Location.findById(req.params.id);
  if(!location) return res.status(404).json({message:"Not found"});

  if(location.voters.includes(ip)){
    return res.status(400).json({message:"Already voted"});
  }

  if(type==="true") location.trueCount++;
  if(type==="fake") location.fakeCount++;

  location.voters.push(ip);
  await location.save();

  res.json({message:"Vote Counted"});
});

export default router;
