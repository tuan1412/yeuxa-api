const roomModel = require('./model');
const fs = require('fs');

const createRoomInfo = ({username1, username2}) => new Promise((resolve, reject) => {
    roomModel
        .create({
            members: [username1, username2]
        })
        .then(data => {
            resolve(data)
        })
        .catch(err => reject(err));
})

module.exports = {
    createRoomInfo
};