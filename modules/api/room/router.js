const express = require('express');
const router = express.Router();

const roomController = require('./controller');

router.get('/', (req,res) => {
    roomController
        .createRoomInfo(req.body)
        .then(data => res.send({id: data._id, username1: data.username1, username2:data.username2}))
        .catch(err => res.send(err));
})

router.get('/info/:id', (req,res) => {
    roomController
        .getRoomInfo(req.params.id)
        .then(members => res.send({members: members}))
        .catch(err => res.status(500).send(err));
})

router.put('/:id', (req,res) => {
    roomController
        .postRoomMessage(req.params.id, req.body)
        .then(data => res.status(200).send(data))
        .catch(err => res.status(500).send(err))
})

// router.get('/:id', (req,res) => {
//     roomController
//         .getRoomMessage(req.params.id)
//         .then(data => res.send(data)
//         .catch(err => res.send(err))
//         )
// })

router.get('/:id', (req,res) => {
    roomController
        .getRoomMessageByPage(req.params.id, req.query.page || 1)
        .then(data => res.send(data))
        .catch(err => {
            console.error(err); 
            res.status(500).send(err);
        })
}) 

module.exports = router;