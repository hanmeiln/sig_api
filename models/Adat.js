const mongoose = require("mongoose");

const AdatSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    desc: { type: String, },
    year: { type: Number, required: true },
    type: { type: String },
    reg_num: { type: String },
    img: { type: String },
    imgs: { type: [String] },
    video: { type: [String] },
    province: { type: mongoose.Types.ObjectId, ref: "Province", required: true, },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Adat", AdatSchema);