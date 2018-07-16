const _ = require("lodash");
const { friendModel, requestStatus } = require("./model");
const UserModel = require("../users/model");
const RoomController = require("../room/controller");

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
    console.log(username);
    console.log(friendname);
    const query = {
      $or: [
        { $and: [{ sender: username }, { receiver: friendname }] },
        { $and: [{ sender: friendname }, { receiver: username }] }
      ],
      $and: [{ active: true }]
    };

    friendModel
      .findOne(query)
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
      .findByIdAndUpdate(id, { status: requestStatus.ACCEPTED }, { new: true })
      .then(response => {
        const updateFriend = async res => {
          try {
            const room = await RoomController.createRoom({
              username1: res.sender,
              username2: res.receiver
            });
            const sender = await UserModel.update(
              { username: res.sender },
              { room: _.toString(room._id) }
            ).exec();
            const receiver = await UserModel.update(
              { username: res.receiver },
              { room: _.toString(room._id) }
            ).exec();
            const disableOtherInvitation = await friendModel
              .updateMany(
                {
                  receiver: res.receiver,
                  status: requestStatus.PENDING,
                  active: true
                },
                { active: false }
              )
              .exec();

            if (sender && receiver && room && disableOtherInvitation)
              return room;
            throw new Error("that bai");
          } catch (error) {
            return error;
          }
        };

        return updateFriend(response);
      })
      .then(data => resolve(data))
      .catch(err => {
        console.log("sadasdasdasdas");
        reject(err);
      });
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
