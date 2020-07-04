const Post = require('../models/Post')
const mongodb = require('mongodb');
const sharp = require('sharp');
const path = require('path')
const fs = require('fs');
const { removeAllListeners } = require('../models/Post');


module.exports = {
    async index(req, res) {
        const posts = await Post.find().sort('-createdAt');
        return res.json(posts);
    },

    async store(req, res) {
        const { author, place, description, hashtags } = req.body;
        const { filename: image } = req.file;

        const [name] = image.split('.');
        const filename = `${name}.jpg`;
        await sharp(req.file.path)
            .jpeg({ quality: 100 })
            .toFile(
                path.resolve(req.file.destination, 'resized', filename)
            )
        fs.unlinkSync(req.file.path);

        const post = await Post.create({
            author,
            place,
            description,
            hashtags,
            image: filename
        })
        req.io.emit('post', post);
        return res.json(post)
    },

    async remove(req, res) {
        const operation = await Post.deleteOne({ _id: new mongodb.ObjectID(req.params.id) })
        let result = {
            code: 1,
            message: "success",
        };
        if (operation.deletedCount == 0)
            result = {
                code: 0,
                message: "failed",
            }
        return res.json({ result })
    },

    async removeAll(req, res) {

        let response;
        const query = { "createdAt": { $gte: new Date("2012-01-12T20:15:31Z").toISOString()} }
        Post.deleteMany(query)
            .then(result => {console.log(`Deleted ${result.deletedCount} item(s).`); response = result})
            .catch(err => console.error(`Delete failed with error: ${err}`))
            .finally(r => {return res.json({ response });})
    }


}