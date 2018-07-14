const roomModel = require('./model');
const fs = require('fs');

const createRoom = ({ username1, username2 }) => {

  console.log(username1);
  return new Promise((resolve, reject) => {
    roomModel
      .create({ members: [username1, username2] })
      .then(data => resolve(data))
      .catch(err => reject(err));
  })
}
  

module.exports = {
  createRoom
};