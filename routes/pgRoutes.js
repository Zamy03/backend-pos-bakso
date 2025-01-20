const express = require("express");
const { addpg, editpg, deletepg, getpg } = require("../controllers/pgController");

const router = express.Router();
router.post("/apg", addpg);
router.put("/epg/:id", editpg);
router.delete("/dpg/:id", deletepg);
router.get("/pg", getpg);

module.exports = router;
