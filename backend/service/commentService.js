import {
    getEveryComment as _getEveryComment,
    getCommentsByUsername as _getCommentsByUsername,
    getCommentsByTeam as _getCommentsByTeam,
    getCommentsByRole as _getCommentsByRole,
    postComment as _postComment,
    updateComment as _updateComment,
    deleteComment as _deleteComment
} from '../repository/commentDAO.js';
import { getUserByUsername } from '../repository/userDAO.js';
import { validate } from 'jsonschema';
import commentPostSchema from '../schemas/commentPostSchema.json'assert { type: "json" };
import commentUpdateSchema from '../schemas/commentUpdateSchema.json'assert { type: "json" };

const getEveryComment = async () => {
    const comments = await _getEveryComment();
    if (!comments || !comments.length) return { response: false, errors: "No comments" };
    return { response: true, message: "Got all comments", comments };
};

const getCommentsByUsername = async username => {
    if (!username) return { response: false, errors: "No username provided" };
    const comments = await _getCommentsByUsername(username);
    if (!comments || !comments.length) return { response: false, errors: "No comments" };
    return { response: true, message: `Got comments from user ${username}`, comments };
};

const getCommentsByTeam = async team_name => {
    if (!team_name) return { response: false, errors: "No team name provided" };
    const comments = await _getCommentsByTeam(team_name);
    if (!comments || !comments.length) return { response: false, errors: "No comments" };
    return { response: true, message: `Got comments for team ${team_name}`, comments };
}

const getCommentsByRole = async role => {
    if (!role) return { response: false, errors: "No role provided" };
    const comments = await _getCommentsByRole(role);
    if (!comments || !comments.length) return { response: false, errors: "No comments" };
    return { response: true, message: `Got comments from role ${role}`, comments };
}

const postComment = async receivedData => {
    const validated = validateCommentPost(receivedData);
    if (!validated.response) return { response: false, errors: validated.errors };
    const foundUser = await getUserByUsername(receivedData.username);
    if (!foundUser) return { response: false, errors: "User not found" };
    const newComment = {
        team_name: receivedData.team_name,
        comment: receivedData.comment
    };
    const data = await _postComment(foundUser.user_id, newComment);
    if (!data) return { response: false, errors: "Could not create comment" };
    return { response: true, message: "Successfully created comment" };
};

const validateCommentPost = receivedData => {
    const validator = validate(receivedData, commentPostSchema);
    if (!validator.valid) {
        const errs = validator.errors.map(e => e.stack);
        return { response: false, errors: errs };
    }
    return { response: true };
};

const updateComment = async receivedData => {
    const validated = validateCommentUpdate(receivedData);
    if (!validated.response) return { response: false, errors: validated.errors };
    const foundUser = await getUserByUsername(receivedData.username);
    if (!foundUser) return { response: false, errors: "User doesn't exist" };
    const comment_index = receivedData.comment_index;
    const updatedComment = {
        team_name: receivedData.team_name,
        comment: receivedData.comment
    };
    const data = await _updateComment(foundUser.user_id, comment_index, updatedComment);
    if (!data) return { response: false, errors: "Could not update comment" };
    return { response: true, message: "Updated comment successfully" };
};

const validateCommentUpdate = receivedData => {
    const validator = validate(receivedData, commentUpdateSchema);
    if (!validator.valid) {
        const errs = validator.errors.map(e => e.stack);
        return { response: false, errors: errs };
    }
    return { response: true };
};

const deleteComment = async (username, comment_index) => {
    if (!username) return { response: false, errors: "No username provided" };
    if (comment_index === null || isNaN(comment_index)) return { response: false, errors: "Invalid comment index" };
    const foundUser = await getUserByUsername(username);
    if (!foundUser) return { response: false, errors: "User doesn't exist" };
    const data = await _deleteComment(foundUser.user_id, comment_index);
    if (!data) return { response: false, errors: "Could not delete comment" };
    return { response: true, message: "Deleted comment successfully" };
}

export {
    getEveryComment,
    getCommentsByUsername,
    getCommentsByTeam,
    getCommentsByRole,
    postComment,
    updateComment,
    deleteComment
}