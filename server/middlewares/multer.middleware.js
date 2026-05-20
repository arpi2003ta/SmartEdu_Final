import multer from "multer";

const storage = multer.memoryStorage();

const singleUpload = multer({ storage }).single("filledOMR");

export default singleUpload;
