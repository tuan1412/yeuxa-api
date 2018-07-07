const {friendModel, requestStatus} = require("./model");
const fs = require("fs");

const createInvitation = ({ username }) =>
  new Promise((resolve, reject) => {
    friendModel
      .create({
        image: fs.readFileSync(imageFile.path),
        contentType: imageFile.mimetype,
        title,
        description,
        createdBy: userId
      })
      .then(data => resolve({ id: data._id }))
      .catch(err => reject(err));
  });

module.exports = {
  createImage,
  getAllImages,
  getImage,
  updateImage,
  deleteImage,
  addComment,
  deleteComment,
  likeImage,
  unlikeImage,
  getImageData
};
