"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getImageUrl = exports.upload = void 0;
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const upload = () => {
    const uploadPath = path_1.default.join(process.cwd(), "uploads");
    if (!fs_1.default.existsSync(uploadPath)) {
        fs_1.default.mkdirSync(uploadPath, { recursive: true });
    }
    const storage = multer_1.default.diskStorage({
        destination: function (req, file, cb) {
            cb(null, uploadPath);
        },
        filename: function (req, file, cb) {
            const uniqueName = Date.now() +
                "-" +
                Math.round(Math.random() * 1e9) +
                "-" +
                file.originalname;
            cb(null, uniqueName);
        },
    });
    return (0, multer_1.default)({ storage });
};
exports.upload = upload;
const getImageUrl = (file) => file?.path
    ? `${process.env.SERVER_URL}/${file.path.replace(/\\/g, "/")}`
    : undefined;
exports.getImageUrl = getImageUrl;
