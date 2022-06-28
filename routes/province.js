const router = require("express").Router();
const Province = require("../models/Province");

const {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
} = require("./verifyToken");
const data = require("../data.json");

//CREATE

// router.post("/", verifyTokenAndAuthorization, async (req, res) => {
//     const newProvince = new Province(req.body);

//     try {
//       const savedProvince = await newProvince.save();
//       res.status(200).json(savedProvince);
//     } catch (err) {
//       res.status(500).json(err);
//     }
//   });
router.post("/", async (req, res) => {
  const newProvince = new Province(req.body);
  try {
    const savedProvince = await newProvince.save();
    res.status(200).json(savedProvince);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/seed", async (req, res) => {
  const newProvince = await Province.create(data);

  res.json({ newProvince });
});

//UPDATE
router.put("/:id", verifyTokenAndAuthorization, async (req, res) => {
  try {
    const updatedProvince = await Province.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    res.status(200).json(updatedProvince);
  } catch (err) {
    res.status(500).json(err);
  }
});

//DELETE
router.delete("/:id", verifyTokenAndAuthorization, async (req, res) => {
  try {
    await Province.findByIdAndDelete(req.params.id);
    res.status(200).json("Provinsi berhasil dihapus");
  } catch (err) {
    res.status(500).json(err);
  }
});

//GET PROVINCE
router.get("/find/:id", async (req, res) => {
  try {
    const province = await Province.findById(req.params.id);
    res.status(200).json(province);
  } catch (err) {
    res.status(500).json(err);
  }
});

//GET ALL PROVINCE
router.get("/", async (req, res) => {
  const qNew = req.query.new;
  const qCategory = req.query.category;
  try {
    let provinces;

    if (qNew) {
      provinces = await Province.find().sort({ createdAt: -1 }).limit(1);
    } else if (qCategory) {
      provinces = await Province.find({
        categories: {
          $in: [qCategory],
        },
      });
    } else {
      provinces = await Province.find();
    }

    res.status(200).json(provinces);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
