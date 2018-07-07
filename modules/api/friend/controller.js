const {friendModel, requestStatus} = require("./model");
const fs = require("fs");

const createImage = ({ title, description, userId, imageFile }) =>
  new Promise((resolve, reject) => {
    imageModel
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
