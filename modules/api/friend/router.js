const express = require("express");
const router = express.Router();
const multer = require("multer");

const friendController = require("./controller");
const authMiddleware = require("../auth/auth");

router.post("/:username", authMiddleware.authorize, (req, res) => {
  imageController
    .getAllImages(req.query.page || 1)
    .then(images => res.send(images))
    .catch(err => {
      console.error(err);
      res.status(500).send(err);
    });
});

module.exports = router;
