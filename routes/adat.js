const router = require("express").Router();
const Adat = require("../models/Adat");

const { 
    verifyToken, 
    verifyTokenAndAuthorization, 
    verifyTokenAndAdmin 
} = require("./verifyToken");

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
      res.status(200).json("Adat has been deleted...");
    } catch (err) {
      res.status(500).json(err);
    }
  });
  
//GET PRODUCT
  router.get("/find/:id", async (req, res) => {
    try {
      const adat = await Adat.findById(req.params.id);
      res.status(200).json(adat);
    } catch (err) {
      res.status(500).json(err);
    }
  });
  
//GET ALL PRODUCTS
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
        adats = await Adat.find().populate("province");
      }
  
      res.status(200).json(adats);
    } catch (err) {
      res.status(500).json(err);
    }
  });

module.exports = router;