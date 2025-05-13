import mongoose from 'mongoose';

//const localUrl = process.env.DATABASE_URL || "mongodb://localhost:27017/brainly";

const UserSchema = new mongoose.Schema({
    username: { type: String },
    password: { type: String, required: true }
});

// Correct way to create the model
export const User = mongoose.model('User', UserSchema);

const ContentSchema = new mongoose.Schema({
    title: {type: String},
    link: {type: String},
    type: {type: String}, 
    tags: [{type: mongoose.Types.ObjectId, ref: 'Tag'}],
    userId: {type: mongoose.Types.ObjectId, ref: 'User',
    required: true}
})

export const ContentModel = mongoose.model('ContentModel', ContentSchema);

const LinkSchema = new mongoose.Schema({
    hash: {type: String},
    userId: {type: mongoose.Types.ObjectId, ref: 'User', unique: true} 
})

export const LinkModel = mongoose.model('LinkModel', LinkSchema);
