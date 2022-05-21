const mongoose = require("mongoose");

const ProvinceSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    geojson: { type: Object, required: true },
    lat: { type: Number, required: true }, //double
    long: { type: Number, required: true } //double
  },
  { timestamps: true }
);

module.exports = mongoose.model("Province", ProvinceSchema);