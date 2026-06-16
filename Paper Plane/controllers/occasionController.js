const Occasion = require("../models/Occasion");

exports.createOccasion = (req, res) => {
  Occasion.create(req.body, (err, result) => {
    if (err) {
      return res.status(500).json(err);
    }

    res.status(201).json({
      message: "Occasion created successfully",
      id: result.insertId,
    });
  });
};

exports.getOccasions = (req, res) => {
  Occasion.getAll((err, results) => {
    if (err) {
      return res.status(500).json(err);
    }

    res.json(results);
  });
};