const Occasion = require("../models/Occasion");
const reminderEngine = require("../services/reminderEngine");

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

exports.getOccasions = async (req, res) => {
  await reminderEngine.run(); // ensure states are dynamically updated

  Occasion.getAll((err, results) => {
    if (err) {
      return res.status(500).json(err);
    }

    res.json(results);
  });
};

exports.updateOccasion = (req, res) => {
  const { id } = req.params;
  Occasion.update(id, req.body, (err, result) => {
    if (err) {
      return res.status(500).json(err);
    }

    res.json({
      message: "Occasion updated successfully",
    });
  });
};

exports.deleteOccasion = (req, res) => {
  const { id } = req.params;
  Occasion.delete(id, (err, result) => {
    if (err) {
      return res.status(500).json(err);
    }
    res.json({ message: "Occasion deleted successfully" });
  });
};