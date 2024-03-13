const commentDAO = require('../repository/commentDAO');
const userDAO = require('../repository/userDAO');
const jsonschema = require('jsonschema');
const commentPostSchema = require('../schemas/commentPostSchema.json');
const commentUpdateSchema = require('../schemas/commentUpdateSchema.json');

const getEveryComment = async () => {
    const comments = await commentDAO.getEveryComment();
    if(!comments || !comments.length) return {response: false, errors: "No comments"};
    return {response: true, message: "Got all comments", comments};
};

const getCommentsByUsername = async username => {
    if(!username) return {response: false, errors: "No username provided"};
    const comments = await commentDAO.getCommentsByUsername(username);
    if(!comments || !comments.length) return {response: false, errors: "No comments"};
    return {response: true, message: `Got comments from user ${username}`, comments};
};

const getCommentsByTeam = async team_name => {
    if(!team_name) return {response: false, errors: "No team name provided"};
    const comments = await commentDAO.getCommentsByTeam(team_name);
    if(!comments || !comments.length) return {response: false, errors: "No comments"};
    return {response: true, message: `Got comments for team ${team_name}`, comments};
}

const getCommentsByRole = async role => {
    if(!role) return {response: false, errors: "No role provided"};
    const comments = await commentDAO.getCommentsByRole(role);
    if(!comments || !comments.length) return {response: false, errors: "No comments"};
    return {response: true, message: `Got comments from role ${role}`, comments};
}

const postComment = async receivedData => {
    const validated = validateCommentPost(receivedData);
    if(!validated.response) return {response: false, errors: validated.errors};
    const foundUser = await userDAO.getUserByUsername(receivedData.username);
    if(!foundUser) return {response: false, errors: "User not found"};
    const newComment = {
        team_name: receivedData.team_name,
        comment: receivedData.comment,
        rating: receivedData.rating
    };
    const data = await commentDAO.postComment(foundUser.user_id, newComment);
    if(!data) return {response: false, errors: "Could not create comment"};
    return {response: true, message: "Successfully created comment"};
};

const validateCommentPost = receivedData => {
    const validator = jsonschema.validate(receivedData, commentPostSchema);
    if(!validator.valid){
        const errs = validator.errors.map(e => e.stack);
        return {response: false, errors: errs};
    }
    return {response: true};
};

const updateComment = async receivedData => {
    const validated = validateCommentUpdate(receivedData);
    if(!validated.response) return {response: false, errors: validated.errors};
    const foundUser = await userDAO.getUserByUsername(receivedData.username);
    if(!foundUser) return {response: false, errors: "User doesn't exist"};
    const comment_index = receivedData.comment_index;
    const updatedComment = {
        team_name: receivedData.team_name,
        comment: receivedData.comment,
        rating: receivedData.rating
    };
    const data = await commentDAO.updateComment(foundUser.user_id, comment_index, updatedComment);
    if(!data) return {response: false, errors: "Could not update comment"};
    return {response: true, message: "Updated comment successfully"};
};

const validateCommentUpdate = receivedData => {
    const validator = jsonschema.validate(receivedData, commentUpdateSchema);
    if(!validator.valid){
        const errs = validator.errors.map(e => e.stack);
        return {response: false, errors: errs};
    }
    return {response: true};
};

const deleteComment = async (username, comment_index) => {
    if(!username) return {response: false, errors: "No username provided"};
    if(comment_index === null || isNaN(comment_index)) return {response: false, errors: "Invalid comment index"};
    const foundUser = await userDAO.getUserByUsername(username);
    if(!foundUser) return {response: false, errors: "User doesn't exist"};
    const data = await commentDAO.deleteComment(foundUser.user_id, comment_index);
    if(!data) return {response: false, errors: "Could not delete comment"};
    return {response: true, message: "Deleted comment successfully"};
}

module.exports = {
    getEveryComment,
    getCommentsByUsername,
    getCommentsByTeam,
    getCommentsByRole,
    postComment,
    updateComment,
    deleteComment
}