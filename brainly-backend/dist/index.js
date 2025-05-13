"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_1 = require("./models/user");
const user_2 = require("./models/user");
const dotenv_1 = __importDefault(require("dotenv"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const middleware_1 = require("./middleware");
const cors_1 = __importDefault(require("cors"));
const utils_1 = require("./utils");
const mongoose_1 = __importDefault(require("mongoose"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)({
    origin: "http://localhost:5173",
    credentials: true
}));
//@ts-ignore
app.post("/api/v1/signup", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).json({ msg: "All fields are required" });
        }
        const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
        const newUser = yield user_1.User.create({ username: username,
            password: hashedPassword });
        const token = jsonwebtoken_1.default.sign({ id: newUser._id }, process.env.JWT_SECRET || "", { expiresIn: "1h" });
        res.status(201).json({
            msg: "User signed up successfully",
            token
        });
    }
    catch (err) {
        console.log("error..", err);
        res.status(500).json({
            msg: "Unable to signup"
        });
    }
}));
//@ts-ignore
app.post("/api/v1/signin", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({
            msg: "Please provide username and password."
        });
    }
    try {
        const user = yield user_1.User.findOne({ username });
        if (!user) {
            return res.status(404).json({
                msg: "User not found"
            });
        }
        const isMatch = yield bcryptjs_1.default.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({
                msg: "Invalid credentials"
            });
        }
        const token = jsonwebtoken_1.default.sign({ id: user._id }, process.env.JWT_SECRET || "", { expiresIn: "1h" });
        res.status(200).json({
            msg: "Login successful",
            token,
            user: { username: user.username }
        });
    }
    catch (error) {
        res.status(500).json({
            msg: "Error signing in user",
        });
    }
}));
//@ts-ignore
app.post("/api/v1/content", middleware_1.userMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { link, title, type } = req.body;
        if (!link || !title) {
            return res.status(400).json({ msg: "Link and type are required." });
        }
        yield user_2.ContentModel.create({
            link,
            type,
            title: req.body.title,
            //@ts-ignore
            userId: req.userId,
            tags: []
        });
        res.json({ msg: "Content added successfully." });
    }
    catch (error) {
        console.error("Error adding content:", error);
        res.status(500).json({ msg: "Failed to add content." });
    }
}));
//@ts-ignore
app.get("/api/v1/content", middleware_1.userMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //@ts-ignore
    const userId = req.userId;
    if (!userId) {
        return res.status(400).json({ msg: "User ID missing." });
    }
    const content = yield user_2.ContentModel.find({
        userId: userId
    }).populate("userId", "username");
    if (!content || content.length === 0) {
        return res.status(404).json({ msg: "No content found." });
    }
    res.json({ content });
}));
//@ts-ignore
app.delete("/api/v1/content/:contentId", middleware_1.userMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { contentId } = req.params;
        if (!contentId) {
            return res.status(400).json({ error: "contentId is required" });
        }
        yield user_2.ContentModel.deleteOne({
            _id: contentId,
            //@ts-ignore
            userId: req.userId // Securely using ID from token
        });
        console.log("Deleted successfully...");
        res.json({ msg: "Content deleted" });
    }
    catch (err) {
        console.error("Error deleting content:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
}));
//@ts-ignore 
app.post("/api/v1/brain/share", middleware_1.userMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const share = req.body.share;
    if (share) {
        const existingLink = yield user_1.LinkModel.findOne({
            userId: req.userId
        });
        if (existingLink) {
            res.json({
                hash: existingLink.hash
            });
            return;
        }
        const hash = (0, utils_1.random)(10);
        yield user_1.LinkModel.create({
            //@ts-ignore 
            userId: req.userId,
            hash: hash
        });
        res.json({
            hash
        });
    }
    else {
        yield user_1.LinkModel.deleteOne({
            //@ts-ignore 
            userId: req.userId
        });
        res.json({
            message: "Removed link"
        });
    }
}));
app.get("/api/v1/brain/:shareLink", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //@ts-ignore 
    const hash = req.params.shareLink;
    const link = yield user_1.LinkModel.findOne({
        hash
    });
    if (!link) {
        res.status(411).json({
            message: "Sorry incorrect input"
        });
        return;
    }
    // userId
    const content = yield user_2.ContentModel.find({
        userId: link.userId
    });
    console.log(link);
    const user = yield user_1.User.findOne({
        _id: link.userId
    });
    if (!user) {
        res.status(411).json({
            message: "user not found, error should ideally not happen"
        });
        return;
    }
    res.json({
        username: user.username,
        content: content
    });
}));
mongoose_1.default.connect(process.env.MONGO_URI || "mongodb://localhost:27017/brainly").then(() => {
    console.log("Connected to MongoDB");
    app.listen(3000);
}).catch((err) => {
    console.error("Failed to connect to MongoDB:", err);
});
exports.default = app;
