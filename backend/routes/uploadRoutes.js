const path = require("path");
const express = require("express");
const multer = require("multer");
const router = express.Router();
const { User } = require("../models/userModel");
const { protect } = require("../middleware/authMiddleware");
const iconv = require("iconv-lite");

const getUploadFileName = (file) => {
  const originalName = iconv.decode(
    Buffer.from(file.originalname, "binary"),
    "utf8"
  );

  return `${Date.now()}-${path.parse(originalName).name}${path.extname(
    originalName
  )}`;
};

///// CHECK FILE TYPES /////
function checkImageFileType(file, cb, storageType) {
  const filetypes = /pdf|jpeg|jpg|png|mp4|mov|avi/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype =
    /^(image\/(jpeg|jpg|png)|video\/(mp4|quicktime|x-msvideo))$/.test(
      file.mimetype
    );

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb({
      message: `Allowed file types for ${storageType}: pdf, jpeg, jpg, png, mp4, mov, avi`,
    });
  }
}

///// STORAGES /////
const profileImages = multer.diskStorage({
  destination: "./uploads/profile-images",
  filename(req, file, cb) {
    cb(null, getUploadFileName(file));
  },
});

const menuImages = multer.diskStorage({
  destination: "./uploads/menu-images",
  filename(req, file, cb) {
    cb(null, getUploadFileName(file));
  },
});

///// INSTANCES /////
const profileImageUpload = multer({
  storage: profileImages,
  fileFilter: function (req, file, cb) {
    checkImageFileType(file, cb, "images");
  },
});

const menuImageUpload = multer({
  storage: menuImages,
  fileFilter: function (req, file, cb) {
    checkImageFileType(file, cb, "images");
  },
});

///// ROUTES /////
router.post(
  "/profile-images",
  protect,
  profileImageUpload.single("image"),
  async (req, res) => {
    try {
      const updatedUser = await User.findByIdAndUpdate(
        req.user.id,
        { $set: { image: req.file.path } },
        {
          new: true,
          runValidators: true,
        }
      );

      res.send({
        message: "Image uploaded successfully",
        file: `${req.file.path}`,
        user: updatedUser,
      });
    } catch (error) {
      console.log("Error while saving image", error);

      return res.status(500).json({ error });
    }
  }
);

router.post(
  "/menu-images",
  protect,
  menuImageUpload.single("image"),
  async (req, res) => {
    try {
      const updatedMenu = await Menu.findByIdAndUpdate(
        req.menu.id,
        { $set: { image: req.file.path } },
        {
          new: true,
          runValidators: true,
        }
      );

      res.send({
        message: "Image uploaded successfully",
        file: `${req.file.path}`,
        menu: updatedMenu,
      });
    } catch (error) {
      return res.status(500).json({ error });
    }
  }
);
module.exports = {
  router,
  profileImageUpload,
  menuImageUpload,
};
