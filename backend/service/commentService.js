const commentDAO = require('../repository/commentDAO');
const userDAO = require('../repository/userDAO');
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

const postComment = async receivedData => {
    const validated = validateComment(receivedData);
    if(!validated.response) return {reponse: false, errors: validated.errors};
    const foundUser = await userDAO.getUserByUsername(receivedData.username);
    if(!foundUser) return {reponse: false, errors: "User not found"};
};

const validateComment = receivedData => {
    const validator = jsonschema.validate(receivedData, commentPostSchema);
    if(!validator.valid){
        const errs = validator.errors.map(e => e.stack);
        return {response: false, errors: errs};
    }
    return {response: true};
}

module.exports = {
    getEveryComment,
    getCommentsByUsername,
    getCommentByTeam,

}