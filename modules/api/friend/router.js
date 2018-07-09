const express = require("express");
const router = express.Router();
const multer = require("multer");

const friendController = require("./controller");
const authMiddleware = require("../auth/auth");
const ErrorHandler = require("../error/ErrorHandler");

router.post("/add-friend", authMiddleware.authorize, (req, res) => {
  let username = req.session.userInfo.username;
  let friendname = req.body.username;
  friendController
    .checkIsFriend(username, friendname)
    .then(response => {      
      if (!response) {
        return friendController.createInvitation(username, friendname);       
      } else {
        switch (response.status) {
          case 0:
            res.send('da gui loi moi');
            break;
          case 1:
            res.send('2 nguoi da la ban');
            break;
          case 2:
            res.send('nick da block');
            break;
        }
      }
    })
    .then(data => res.send(data._id))
    .catch(err => {      
      console.error(err);
      res.status(500).send(err);
    });
});

router.get(
  '/list-invitation',
  authMiddleware.authorize,
  (req, res) => {
    let username = req.session.userInfo.username;
    friendController
    .getInvitationList(username)
    .then(response => res.send(response))
    .catch(err => res.status(500).send(err))
  }
);

router.put(
  '/accept-invitation',
  authMiddleware.authorize,
  (req, res) => {    
    friendController
    .acceptInvitation(req.body.id)
    .then(response => res.send(response))
    .catch(err => res.status(500).send(err))
  }
);

router.put(
  '/reject-invitation',
  authMiddleware.authorize,
  (req, res) => {    
    friendController
    .rejectInvitation(req.body.id)
    .then(response => res.send(response))
    .catch(err => res.status(500).send(err))
  }
);

router.delete(
  '/unfriend',
  authMiddleware.authorize,
  (req, res) => {    
    friendController
    .deleteInvitation(req.body.id)
    .then(response => res.send(response))
    .catch(err => res.status(500).send(err))
  }
);

module.exports = router;
