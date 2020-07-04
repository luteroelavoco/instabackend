const express = require('express');
const PostController = require('./controllers/PostController');
const LikeController = require('./controllers/LikeController');
const multer = require('multer')
const uploadConfig = require('./config/upload') 
const routes = new express.Router();

const upload = multer(uploadConfig);

routes.get('/posts',PostController.index)
//routes.post('/posts',upload.single('image'),PostController.store)
//routes.delete('/posts/:id',PostController.remove)
routes.post('/posts/:id/like',LikeController.store)
//routes.delete('/deleteAll',PostController.removeAll);

module.exports = routes;