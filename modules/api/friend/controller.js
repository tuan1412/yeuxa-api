const { friendModel, requestStatus } = require("./model");

const createInvitation = (username, friendname) =>
  new Promise((resolve, reject) => {
    friendModel
      .create({
        sender: username,
        receiver: friendname
      })
      .then(data => resolve(data))
      .catch(err => reject(err));
  });

const checkIsFriend = (username, friendname) =>
  new Promise((resolve, reject) => {
    const query = {
      $or: [
        { $and: [{ sender: username }, { receiver: friendname }] },
        { $and: [{ sender: friendname }, { receiver: username }] }
      ],
      $and: [{ active: true }]
    };

    friendModel
      .findOne({}, query)
      .select("_id status")
      .exec()
      .then(res => resolve(res))
      .catch(err => reject(err));
  });

const getInvitationList = username =>
  new Promise((resolve, reject) => {
    const query = {
      $and: [
        { $or: [{ sender: username }, { receiver: username }] },
        { status: requestStatus.PENDING, active: true }
      ]
    };

    friendModel
      .find(query)
      .then(res => resolve(res))
      .catch(err => reject(err));
  });

const acceptInvitation = id =>
  new Promise((resolve, reject) => {
    console.log(id);
    friendModel
      .update(
        {
          _id: id,
          active: true
        },
        {
          status: requestStatus.ACCEPTED
        }
      )
      .then(res => resolve(res))
      .catch(err => reject(err));
  });

const rejectInvitation = id =>
  new Promise((resolve, reject) => {
    console.log(id);
    friendModel
      .update(
        {
          _id: id,
          active: true
        },
        {
          status: requestStatus.REJECTED
        }
      )
      .then(res => resolve(res))
      .catch(err => reject(err));
  });

const deleteInvitation = id =>
  new Promise((resolve, reject) => {
    console.log(id);
    friendModel
      .update(
        {
          _id: id,
          active: true
        },
        {
          active: false
        }
      )
      .then(res => resolve(res))
      .catch(err => reject(err));
  });

module.exports = {
  createInvitation,
  checkIsFriend,
  getInvitationList,
  acceptInvitation,
  rejectInvitation,
  deleteInvitation
};
