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

const getRoomMessage = (id) => new Promise((resolve, reject) => {
    roomModel
        .findByIdAndUpdate(
            {
                _id: id
            },
            {
                messages: [
                    {
                        seen : true
                    }
                ]
            }
        ) 
        .sort({ createdAt: 1})
        .skip((page-1) * 10)
        .limit(10)
        .select('members messages')
        .exec()
        .then(data => resolve(data))
        .catch(err => {
            reject(err);
        });
});

const postRoomMessage = ({username, content}) => new Promise((resolve, reject) => {
    roomModel
        .create({ messages: 
            [
                {
                    username: username
                },
                {
                    body: content
                },
                {
                    seen: false
                }
            ]
       })
       .exec()
       .then(data => resolve(data))
       .catch(err => reject(err));
});

const getRoomMessageByPage = page => new Promise((resolve, reject) => {
    roomModel
        .find(
            { 
                messages: [
                    {
                        seen: true
                    }
                ]
            }
        .sort({ createdAt: -1})
        .skip((page-1) * 20)
        .limit(20)
        .select('members messages')
        .exec()
        .then(data => resolve(data))
        .catch(err => {
            reject(err);
        })
        )
})

module.exports = {
    createRoomInfo,
    getRoomMessage,
    postRoomMessage,
    getRoomMessageByPage
};