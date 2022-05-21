const mongoose = require("mongoose");

const AdatSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    desc: { type: String, },
    year: { type: String, required: true },
    type: { type: String, required: true },
    reg_num: { type: String, required: true },
    img: { type: [String] },
    video: { type: [String] },
    province: { type: mongoose.Types.ObjectId, ref: "Province" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Adat", AdatSchema);