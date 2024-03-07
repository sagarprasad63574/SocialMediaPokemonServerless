const commentDAO = require('../repository/commentDAO');
const jsonschema = require('jsonschema');
const commentPostSchema = require('../schemas/commentPostSchema.json');

const getEveryComment = async () => {
    const comments = await commentDAO.getEveryComment();
    if(!comments) return {response: false, errors: "No comments"};
    return {response: true, message: "Got all comments", comments};
};

const getCommentsByUsername = async username => {
    if(!username) return {response: false, errors: "No username provided"};
    const comments = await commentDAO.getCommentByUsername(username);
    if(!comments) return {response: false, errors: "No comments"};
    return {response: true, message: `Got comments from user ${username}`};
};

const getCommentByTeam = async team_name => {
    if(!team_name) return {response: false, errors: "No team name provided"};
    const comments = await commentDAO.getCommentByTeam(team_name);
    if(!comments) return {response: false, errors: "No comments"};
    return {response: true, message: `Got comments for team ${team_name}`, comments};
}

module.exports = {
    getEveryComment,
    getCommentsByUsername,
}