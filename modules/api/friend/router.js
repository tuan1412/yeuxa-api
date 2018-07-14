const express = require("express");

const router = express.Router();

const friendController = require("./controller");
const authMiddleware = require("../auth/auth");

router.post("/add-friend", authMiddleware.authorize, (req, res) => {
  const { username } = req.session.userInfo;
  const friendname = req.body.username;
  friendController
    .checkIsFriend(username, friendname)
    .then(response => {      
      if (!response) {
        return friendController.createInvitation(username, friendname);        
      }
      
      switch (response.status) {
        case 0:
          res.send("da gui loi moi");
          break;
        case 1:
          res.send("2 nguoi da la ban");
          break;
        case 2:
          res.send("nick da block");
          break;
        default:
          res.send("default");
          break;
      }      
    })
    .then(data => res.send(data))
    .catch(err => {
      console.error(err);
      res.status(500).send(err);
    });
});

router.get("/list-invitation", authMiddleware.authorize, (req, res) => {
  const { username } = req.session.userInfo;
  friendController
    .getInvitationList(username)
    .then(response => res.send(response))
    .catch(err => res.status(500).send(err));
});

router.put("/accept-invitation", authMiddleware.authorize, (req, res) => {
  friendController
    .acceptInvitation(req.body.id)
    .then(response => res.send(response))
    .catch(err => res.status(500).send(err));
});

router.put("/reject-invitation", authMiddleware.authorize, (req, res) => {
  friendController
    .rejectInvitation(req.body.id)
    .then(response => res.send(response))
    .catch(err => res.status(500).send(err));
});

router.delete("/unfriend", authMiddleware.authorize, (req, res) => {
  friendController
    .deleteInvitation(req.body.id)
    .then(response => res.send(response))
    .catch(err => res.status(500).send(err));
});

module.exports = router;
