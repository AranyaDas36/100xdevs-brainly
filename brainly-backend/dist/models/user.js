"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LinkModel = exports.ContentModel = exports.User = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
//const localUrl = process.env.DATABASE_URL || "mongodb://localhost:27017/brainly";
const UserSchema = new mongoose_1.default.Schema({
    username: { type: String },
    password: { type: String, required: true }
});
// Correct way to create the model
exports.User = mongoose_1.default.model('User', UserSchema);
const ContentSchema = new mongoose_1.default.Schema({
    title: { type: String },
    link: { type: String },
    type: { type: String },
    tags: [{ type: mongoose_1.default.Types.ObjectId, ref: 'Tag' }],
    userId: { type: mongoose_1.default.Types.ObjectId, ref: 'User',
        required: true }
});
exports.ContentModel = mongoose_1.default.model('ContentModel', ContentSchema);
const LinkSchema = new mongoose_1.default.Schema({
    hash: { type: String },
    userId: { type: mongoose_1.default.Types.ObjectId, ref: 'User', unique: true }
});
exports.LinkModel = mongoose_1.default.model('LinkModel', LinkSchema);
