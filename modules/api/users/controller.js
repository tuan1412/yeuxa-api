const userModel = require("./model");
const fs = require("fs");

const checkNotHasFriend = (req, res, next) => {
  if (req.session.userInfo.room) {
    res.send('da co ban roi')
  } else {
    next()
  }
};

const checkUserExist = (req, res, next) => { 
  userModel
    .findOne({
      active: true,
      username: req.body.username
    })    
    .then(data => {      
      if (data) {
        next();
      } else {
        res.status(402).send('khong ton tai user nay');
      }      
    })
    .catch(err => res.status(500).send(err));
};

const createUser = ({ username, fullname, password, imageFile }) =>
  new Promise((resolve, reject) => {
    userModel
      .create({
        avatar: fs.readFileSync(imageFile.path),
        contentType: imageFile.mimetype,
        username,
        fullname,
        password
      })
      .then(user => resolve(user._id))
      .catch(err => reject(err));
  });

const getAllUsers = page =>
  new Promise((resolve, reject) => {
    userModel
      .find({
        active: true
      })
      .sort({ createdAt: -1 })
      .skip((page - 1) * 20)
      .limit(20)
      .select("_id username fullname")
      .exec()
      .then(data =>
        resolve(
          data.map(user =>
            Object.assign({}, user._doc, {
              avatarUrl: `/api/users/${user._id}/avatar`
            })
          )
        )
      )
      .catch(err => reject(err));
  });

const getOneUser = username =>
  new Promise((resolve, reject) => {
    userModel
      .findOne({
        active: true,
        username: username
      })
      .select("_id username fullname password")
      .exec()
      .then(data =>
        resolve(
          Object.assign({}, data._doc, { avatarUrl: `/api/users/avatar/${data._id}` })
        )
      )
      .catch(err => reject(err));
  });

const getAvatarData = id =>
  new Promise((resolve, reject) => {
    userModel
      .findOne({
        active: true,
        _id: id
      })
      .select("avatar contentType")
      .exec()
      .then(data => resolve(data))
      .catch(err => reject(err));
  });

const updateUsername = (id, username) =>
  new Promise((resolve, reject) => {
    userModel
      .update(
        {
          _id: id
        },
        {
          username
        }
      )
      .exec()
      .then(data => resolve(data))
      .catch(err => reject(err));
  });

const updateFullname = (username, fullname) =>
  new Promise((resolve, reject) => {
    userModel
      .update(
        {
          username: username
        },
        {
          fullname
        }
      )
      .exec()
      .then(data => resolve(data))
      .catch(err => reject(err));
  });

const updatePassword = (id, password) =>
  new Promise((resolve, reject) => {
    userModel
      .findById(id)
      .then(user => {
        user.password = password;
        return user.save();
      })
      .then(data => resolve(data._id))
      .catch(err => reject(err));
  });

const updateAvatar = (id, avatarFile) =>
  new Promise((resolve, reject) => {
    userModel
      .update(
        {
          _id: id
        },
        {
          avatar: fs.readFileSync(avatarFile.path),
          contentType: avatarFile.mimetype
        }
      )
      .exec()
      .then(data => resolve(data))
      .catch(err => reject(err));
  });

const deleteUser = id =>
  new Promise((resolve, reject) => {
    userModel
      .update({ _id, id }, { active: false })
      .exec()
      .then(data => resolve(data._id))
      .catch(err => reject(err));
  });

const getUserForAuth = username =>
  new Promise((resolve, reject) => {
    userModel
      .findOne({ username })
      .select("username password _id room")
      .then(user => resolve(user))
      .catch(err => reject(err));
  });

module.exports = {
  createUser,
  getAllUsers,
  getOneUser,
  updateUsername,
  updateFullname,
  updatePassword,
  updateAvatar,
  deleteUser,
  getUserForAuth,
  getAvatarData,
  checkNotHasFriend,
  checkUserExist
};
