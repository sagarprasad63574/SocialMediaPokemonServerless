const jwt = require('jsonwebtoken');
const { SECRET_KEY } = require('../config');
const { UnauthorizedError } = require("../util/expressError");

function authenticateJWT(req, res, next) {
    try {
        const authHeader = req.headers && req.headers.authorization;
        if (authHeader) {
            const token = authHeader.replace(/^[Bb]earer /, "").trim();
            req.user = jwt.verify(token, SECRET_KEY);
        }
        return next();
    } catch (err) {
        next(err);
    }
}

function ensureLoggedIn(req, res, next) {
    try {
        if (!req.user) throw new UnauthorizedError();
        return next();
    } catch (err) {
        return next(err);
    }
}

function ensureAdmin(req, res, next) {
    try {
        if (!req.user || req.user.role !== "manager") {
            throw new UnauthorizedError();
        }
        return next();
    } catch (err) {
        return next(err);
    }
}

function ensureCorrectUserOrAdmin(req, res, next) {
    try {
        const user = req.user;
        if (!(user && (user.role || user.username === req.params.username))) {
            throw new UnauthorizedError();
        }
        return next();
    } catch (err) {
        return next(err);
    }
}

module.exports = { authenticateJWT, ensureLoggedIn, ensureAdmin, ensureCorrectUserOrAdmin };