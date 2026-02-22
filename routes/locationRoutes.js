const express = require('express');
const router = express.Router();
const Location = require('../models/Location');

/* ===== GET ALL APPROVED ===== */
router.get('/', async (req, res) => {
  const data = await Location.find({
    approved: true,
    createdAt: { $gte: new Date(Date.now() - 24*60*60*1000) }
  }).sort({ createdAt: -1 });

  res.json(data);
});

/* ===== SEARCH ===== */
router.get('/search', async (req, res) => {
  const q = req.query.q || "";

  const data = await Location.find({
    approved: true,
    name: { $regex: q, $options: 'i' },
    createdAt: { $gte: new Date(Date.now() - 24*60*60*1000) }
  });

  res.json(data);
});

/* ===== ADD ===== */
router.post('/', async (req, res) => {
  const { name, lat, lng } = req.body;

  const newLoc = new Location({
    name,
    lat,
    lng,
    approved: false,
    trueVotes: 0,
    falseVotes: 0
  });

  await newLoc.save();
  res.json({ message: "Submitted for approval" });
});

/* ===== VOTE ===== */
router.post('/vote/:id', async (req, res) => {
  const { type } = req.body;

  const loc = await Location.findById(req.params.id);
  if (!loc) return res.status(404).json({ message: "Not found" });

  if (type === 'true') loc.trueVotes++;
  if (type === 'false') loc.falseVotes++;

  await loc.save();
  res.json({ message: "Voted" });
});

module.exports = router;
