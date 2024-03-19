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

router.get('/', ensureLoggedIn, async (req, res, next) => {
    const username = res.locals.user.username;
    const showTeamId = req.query.team_id;
    const showRole = req.query.role;
    const showAll = req.query.showAll;
    const allByTeam = req.query.allByTeam;
    try {
        if(showTeamId){
            const data = await commentService.getCommentsByTeam(showTeamId);
            if(!data.response) throw new NotFoundError(data.errors);
            return res.status(200).json(data);
        }
        if(showRole){
            const data = await commentService.getCommentsByRole(showRole);
            if(!data.response) throw new NotFoundError(data.errors);
            return res.status(200).json(data);
        }
        if(showAll){
            const data = await commentService.getEveryComment();
            if(!data.response) throw new NotFoundError(data.errors);
            return res.status(200).json(data);
        }
        if(allByTeam){
            const data = await commentService.getAllCommentsGroupedByTeam();
            if(!data.response) throw new NotFoundError(data.errors);
            return res.status(200).json(data);
        }
        const data = await commentService.getCommentsByUsername(username);
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