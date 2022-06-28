const router = require("express").Router();
const Adat = require("../models/Adat");
const Province = require("../models/Province");
const { 
    verifyToken, 
    verifyTokenAndAuthorization, 
    verifyTokenAndAdmin 
} = require("./verifyToken");
const { std } = require("mathjs");

//CREATE

router.post("/", verifyTokenAndAuthorization, async (req, res) => {
    const newAdat = new Adat(req.body);
  
    try {
      const savedAdat = await newAdat.save();
      res.status(200).json(savedAdat);
    } catch (err) {
      res.status(500).json(err);
    }
  });

//UPDATE
router.put("/:id", verifyTokenAndAuthorization, async (req, res) => {
    try {
      const updatedAdat = await Adat.findByIdAndUpdate(
        req.params.id,
        {
          $set: req.body,
        },
        { new: true }
      );
      res.status(200).json(updatedAdat);
    } catch (err) {
      res.status(500).json(err);
    }
  });
  
//DELETE
  router.delete("/:id", verifyTokenAndAuthorization, async (req, res) => {
    try {
      await Adat.findByIdAndDelete(req.params.id);
      res.status(200).json("Adat berhasil di hapus");
    } catch (err) {
      res.status(500).json(err);
    }
  });
  
//GET ADAT
  router.get("/find/:id", async (req, res) => {
    try {
      const adat = await Adat.findById(req.params.id).populate(
        "province"
      );
      res.status(200).json(adat);
    } catch (err) {
      res.status(500).json(err);
    }
  });
  
//GET ALL ADAT
  router.get("/", async (req, res) => {
    const qNew = req.query.new;
    const qCategory = req.query.category;
    try {
      let adats;
  
      if (qNew) {
        adats = await Adat.find().sort({ createdAt: -1 }).limit(1);
      } else if (qCategory) {
        adats = await Adat.find({
          categories: {
            $in: [qCategory],
          },
        });
      } else {
        adats = await Adat.find().populate("province", "name");
      }
  
      res.status(200).json(adats);
    } catch (err) {
      res.status(500).json(err);
    }
  });

  // COUNT PER PROVINCE
router.get("/count", async (req, res) => {
  const pipeline = [{ $group: { _id: "$province", count: { $sum: 1 } } }];
  const test = [
      {
          $group: {
              _id: "$province",
              count: { $sum: 1 },
          },
      },
      {
          $lookup: {
              from: "province",
              localField: "_id",
              foreignField: "_id",
              as: "province",
          },
      },
      { $unwind: "$province" },
  ];

  try {
      adats = await Adat.aggregate(pipeline);
      // provinces = await Province.aggregate(coba);
      // await Province.populate(cultures, { path: "_id" });

      res.status(200).json(adats);
  } catch (err) {
      res.status(500).json(err);
  }
});

// CALCULATION

router.get("/calculate", async (req, res) => {
  const pipeline = [{ $group: { _id: "$province", count: { $sum: 1 } } }];

  try {
      adats = await Adat.aggregate(pipeline);
      jumlahBudaya = await Adat.count();
      jumlahProvinsi = await Province.count();

      counts = adats.map((item) => item.count);
      average = jumlahBudaya / jumlahProvinsi;
      standarDev = std(counts);
      n = 1;
      high = average + n * standarDev;
      low = average - n * standarDev;

      let highProvince = 0;
      let lowProvince = 0;

      adats.forEach((adat) => {
          if (adat.count > high) {
              highProvince += 1;
          }
          if (adat.count < low) {
              lowProvince += 1;
          }
      });

      let midProvince = jumlahProvinsi - highProvince - lowProvince;

      res.status(200).json({
          jumlahBudaya,
          jumlahProvinsi,
          average,
          standarDev,
          n,
          high,
          low,
          highProvince,
          lowProvince,
          midProvince,
      });
  } catch (err) {
      res.status(500).json(err);
  }
});

module.exports = router;