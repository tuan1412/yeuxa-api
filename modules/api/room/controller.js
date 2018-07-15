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

const getRoomInfo = id => new Promise((resolve, reject) => {
    roomModel
        .findById({
            _id: id
        })
        .exec()
        .then(data => resolve(data.members))
        .catch(err => reject(err))
})
  

// const getRoomMessage = id => new Promise((resolve, reject) => {
//     roomModel
//         .findByIdAndUpdate(
//             {
//                 _id: id
//             },
//             {
//                 messages: 
//                     {
//                         seen : true
//                     }
                
//             }
//         ) 
//         .sort({ createdAt: 1})
//         .limit(10)
//         .select('members messages')
//         .exec()
//         .then(data => resolve(data))
//         .catch(err => {
//             reject(err);
//         });
// });

const postRoomMessage = (id, {username, contents}) => new Promise((resolve, reject) => {
    roomModel
        .update(
            {_id: id},
            { $push : { messages: 
                {
                    userName: username,
                    body: contents,
                    seen: false
                }  
       }})
       .exec()
       .then(data => resolve(data))
       .catch(err => reject(err));
});

const getRoomMessageByPage = (id, page) => 
    new Promise((resolve, reject) => {
    roomModel
        .findOne({_id: id}) 
        .sort({ createdAt: -1})
        .skip((page-1) * 20)
        .limit(20)
        .exec()
        .then(data => resolve(data.messages))
        .catch(err => {
            reject(err);
        })
})

module.exports = {
    createRoom,
    // getRoomMessage,
    postRoomMessage,
    getRoomMessageByPage,
    getRoomInfo
};