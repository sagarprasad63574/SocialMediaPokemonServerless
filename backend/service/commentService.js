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

const getCommentsByTeam = async team_id => {
    if(!team_id) return {response: false, errors: "No team id provided"};
    const comments = await commentDAO.getCommentsByTeam(team_id);
    if(!comments || !comments.length) return {response: false, errors: "No comments"};
    return {response: true, message: `Got comments for team ${team_id}`, comments};
}

const getAllCommentsGroupedByTeam = async () => {
    const allComments = await commentDAO.getEveryComment();
    if(!allComments || !allComments.length) return {response: false, errors: "No comments"};
    const teamIDs = [];
    const allTeamComments = [];
    for(let i=0; i<allComments.length; i++){
        let currentUser = allComments[i];
        for(let j=0; j<currentUser.comments.length; j++){
            if(!teamIDs.includes(currentUser.comments[j].team_id)) teamIDs.push(currentUser.comments[j].team_id);
        }
    }
    for(let i=0; i<teamIDs.length; i++){
        let currentID = teamIDs[i];
        let teamComments = [];
        for(let j=0; j<allComments.length; j++){
            let currentUser = allComments[j];
            let reducedComments = currentUser.comments.filter(comment => {return comment.team_id === currentID});
            if(!reducedComments || !reducedComments.length) continue;
            let reducedUser = {
                username: currentUser.username,
                comments: reducedComments
            };
            teamComments.push(reducedUser);
        }
        allTeamComments.push({team_id: currentID, comments: teamComments});
    }
    if(!allTeamComments || !allTeamComments.length) return {response: false, errors: "No Team Comments"};
    return {response: true, message: "Got all comments for all teams", comments: allTeamComments};
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
    const foundTeam = await commentDAO.getTeamById(receivedData.team_id);
    if(!foundTeam) return {response: false, errors: "Team does not exist"};
    if(!foundTeam.post) return {response: false, errors: "Team has not been posted yet"};
    const newComment = {
        team_id: receivedData.team_id,
        comment: receivedData.comment,
        rating: receivedData.rating,
        timestamp: new Date().toISOString()
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
    const foundTeam = await commentDAO.getTeamById(receivedData.team_id);
    if(!foundTeam) return {response: false, errors: "Team does not exist"};
    if(!foundTeam.post) return {response: false, errors: "Team has not been posted yet"};
    const comment_index = receivedData.comment_index;
    const updatedComment = {
        team_id: receivedData.team_id,
        comment: receivedData.comment,
        rating: receivedData.rating,
        timestamp: new Date().toISOString()
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
    getAllCommentsGroupedByTeam,
    postComment,
    updateComment,
    deleteComment
}