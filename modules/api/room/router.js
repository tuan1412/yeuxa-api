const express = require('express');
const router = express.Router();

const roomController = require('./controller');

router.get('/', (req,res) => {
    roomController
        .createRoomInfo(req.body)
        .then(data => res.send({id: data._id, username1: data.username1, username2:data.username2}))
        .catch(err => ress.send(err));
})

module.exports = router;