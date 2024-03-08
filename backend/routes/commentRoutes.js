const express = require('express');
const commentService = require('../service/commentService');
const { ensureLoggedIn } = require('../middleware/auth');
const { BadRequestError, NotFoundError } = require('../util/expressError');
const router = express.Router();

router.post('/', ensureLoggedIn, async (req, res, next) => {
    const username = res.locals.user.username;
    try {
        const data = await commentService.postComment({username, ...req.body});
        if(!data.response) throw new BadRequestError(data.errors);
        return res.status(201).json(data);
    } catch (error) {
        return next(error);
    }
});

router.get('/', async (req, res, next) => {
    const username = req.query.username;
    const team_name = req.query.team_name;
    const role = req.query.role;
    try {
        if(username){
            const data = await commentService.getCommentsByUsername(username);
            if(!data.response) throw new NotFoundError(data.errors);
            return res.status(200).json(data);
        }
        if(team_name){
            const data = await commentService.getCommentByTeam(team_name);
            if(!data.response) throw new NotFoundError(data.errors);
            return res.status(200).json(data);
        }
        const data = await commentService.getEveryComment();
        if(!data.response) throw new NotFoundError(data.errors);
        return res.status(200).json(data);
    } catch (error) {
        return next(error);
    }
});

router.put('/', ensureLoggedIn, async (req, res, next) => {
    const username = res.locals.user.username;
    const comment_index = Number(req.query.comment_index);
    try {
        if(comment_index === null) throw new BadRequestError("No comment index provided");
        const data = await commentService.updateComment({username, ...req.body, comment_index});
        if(!data.response) throw new BadRequestError(data.errors);
        return res.status(200).json(data);
    } catch (error) {
        return next(error);
    }
});

router.delete('/', ensureLoggedIn, async (req, res, next) => {
    const username = res.locals.user.username;
    const indexQuery = Number(req.query.comment_index);
    try {
        if(indexQuery === null) throw new BadRequestError("No comment index provided");
        const data = await commentService.deleteComment(username, indexQuery);
        if(!data.response) throw new BadRequestError(data.errors);
        return res.status(200).json(data);
    } catch (error) {
        return next(error);
    }
});

module.exports = router;