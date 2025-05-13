import express, { Request, Response } from "express";
import jwt from "jsonwebtoken";
import {LinkModel, User} from "./models/user";
import { ContentModel } from "./models/user";
import dotenv from 'dotenv';
import bcrypt from "bcryptjs";
import { userMiddleware } from "./middleware";
import cors from 'cors';
import {random} from "./utils"
import mongoose from "mongoose";

dotenv.config();

const app = express();

app.use(express.json());

app.use(cors({
    origin: "*", 
    credentials: true
}));

//@ts-ignore
app.post("/api/v1/signup", async (req, res) => {
    try{
        const {username, password} = req.body;

        if (!username || !password) {
            return res.status(400).json({ msg: "All fields are required" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await User.create({ username: username, 
                                            password: hashedPassword});

        const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET || "", { expiresIn: "1h" });

        res.status(201).json({
            msg: "User signed up successfully",
            token
        });

    }catch(err){
        console.log("error..", err);
        res.status(500).json({
            msg: "Unable to signup"
        })
    }
})

//@ts-ignore
app.post("/api/v1/signin", async (req, res)=>{
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({
            msg: "Please provide username and password."
        });
    }

    try {
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(404).json({
                msg: "User not found"
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({
                msg: "Invalid credentials"
            });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || "", { expiresIn: "1h" });
        res.status(200).json({
            msg: "Login successful",
            token,
            user: { username: user.username }
        });
    } catch (error) {
        res.status(500).json({
            msg: "Error signing in user",
        });
    }
})
 
//@ts-ignore
app.post("/api/v1/content", userMiddleware, async (req, res) => {
    try {
        const { link, title, type} = req.body;

        if (!link || !title) {
            return res.status(400).json({ msg: "Link and type are required." });
        }

        await ContentModel.create({
            link,
            type,
            title:req.body.title,
            //@ts-ignore
            userId: req.userId,
            tags: []
        });

        res.json({ msg: "Content added successfully." });
    } catch (error) {
        console.error("Error adding content:", error);
        res.status(500).json({ msg: "Failed to add content." });
    }
}); 

//@ts-ignore
app.get("/api/v1/content", userMiddleware, async (req, res) => {
    //@ts-ignore
    const userId = req.userId;

    if (!userId) {
        return res.status(400).json({ msg: "User ID missing." });
    }

    const content = await ContentModel.find({
        userId: userId
    }).populate("userId", "username");

    if (!content || content.length === 0) {
        return res.status(404).json({ msg: "No content found." });
    }

    res.json({ content });
});

//@ts-ignore
app.delete("/api/v1/content/:contentId", userMiddleware, async (req, res) => {
    try {
      const { contentId } = req.params;
  
      if (!contentId) {
        return res.status(400).json({ error: "contentId is required" });
      }
  
      await ContentModel.deleteOne({
        _id: contentId,
        //@ts-ignore
        userId: req.userId  // Securely using ID from token
      });
  
      console.log("Deleted successfully...");
      res.json({ msg: "Content deleted" });
    } catch (err) {
      console.error("Error deleting content:", err);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });
  

//@ts-ignore 
app.post("/api/v1/brain/share", userMiddleware, async(req, res)=>{
    const share = req.body.share;
    if (share) {
            const existingLink = await LinkModel.findOne({//@ts-ignore 

                userId: req.userId
            });

            if (existingLink) {
                res.json({
                    hash: existingLink.hash
                })
                return;
            }
            const hash = random(10);
            await LinkModel.create({
                //@ts-ignore 

                userId: req.userId,
                hash: hash
            })

            res.json({
                hash
            })
    } else {
        await LinkModel.deleteOne({
            //@ts-ignore 

            userId: req.userId
        });

        res.json({
            message: "Removed link"
        })
    }
})

app.get("/api/v1/brain/:shareLink", async (req, res)=>{
    //@ts-ignore 
    const hash = req.params.shareLink;

    const link = await LinkModel.findOne({
        hash
    });

    if (!link) {
        res.status(411).json({
            message: "Sorry incorrect input"
        })
        return;
    }
    // userId
    const content = await ContentModel.find({
        userId: link.userId
    })

    console.log(link);
    const user = await User.findOne({
        _id: link.userId
    })

    if (!user) {
        res.status(411).json({
            message: "user not found, error should ideally not happen"
        })
        return;
    }

    res.json({
        username: user.username,
        content: content
    })

})

//@ts-ignore
mongoose.connect(process.env.localUrl).then(() => {
    console.log("Connected to MongoDB");

    app.listen(3000)
}).catch((err) => {
    console.error("Failed to connect to MongoDB:", err);
});


export default app;