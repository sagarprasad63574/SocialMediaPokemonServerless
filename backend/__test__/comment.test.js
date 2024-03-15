const commentService = require('../service/commentService');
const commentDAO = require('../repository/commentDAO');
const userDAO = require('../repository/userDAO');

jest.mock('../repository/commentDAO');
jest.mock('../repository/userDAO');

describe('Getting Comments', () => {
    test('Getting all comments but empty, should return false', async () => {
        commentDAO.getEveryComment.mockResolvedValueOnce([]);
        const data = await commentService.getEveryComment();
        expect(data.response).toBeFalsy();
    });
    test('Getting all comments with comments present, should return true', async () => {
        const comments = [
            {
                username: "testuser1",
                comment: {
                    team_id: "0456031564",
                    comment: "test comment 1",
                    rating: 1,
                    timestamp: "date"
                }
            },
            {
                username: "testuser2",
                comment: {
                    team_id: "04896351",
                    comment: "test comment 2",
                    rating: 2,
                    timestamp: "date"
                }
            }
        ];
        commentDAO.getEveryComment.mockResolvedValueOnce(comments);
        const data = await commentService.getEveryComment();
        expect(data.response).toBeTruthy();
    });
    test('Getting comments by username but no username provided, should return false', async () => {
        const data = await commentService.getCommentsByUsername();
        expect(data.response).toBeFalsy();
    });
    test('Getting comments by username but no comments, should return false', async () => {
        commentDAO.getCommentsByUsername.mockResolvedValueOnce([]);
        const data = await commentService.getCommentsByUsername("testuser");
        expect(data.response).toBeFalsy();
    });
    test('Getting comments by username with comments, should return true', async () => {
        const uComments = [
            {
                team_id: "0410861",
                comment: "This is a test comment",
                rating: 1,
                timestamp: "time"
            },
            {
                team_id: "148096513",
                comment: "This is a second test comment",
                rating: 2,
                timestamp: "time"
            }
        ];
        commentDAO.getCommentsByUsername.mockResolvedValueOnce(uComments);
        const data = await commentService.getCommentsByUsername("testuser");
        expect(data.response).toBeTruthy();
    });
    test('Getting comments by team id but no team id provided, should return false', async () => {
        const data = await commentService.getCommentsByTeam();
        expect(data.response).toBeFalsy();
    });
    test('Getting comments by team id but no comments, should return false', async () => {
        commentDAO.getCommentsByTeam.mockResolvedValueOnce([]);
        const data = await commentService.getCommentsByTeam("0");
        expect(data.response).toBeFalsy();
    });
    test('Getting comments by team id with comments, should return true', async () => {
        const comments = [
            {
                username: "testuser1",
                comment: {
                    team_id: "012345",
                    comment: "test comment 1",
                    rating: 1,
                    timestamp: "date"
                }
            },
            {
                username: "testuser2",
                comment: {
                    team_id: "012345",
                    comment: "test comment 2",
                    rating: 2,
                    timestamp: "date"
                }
            }
        ];
        commentDAO.getCommentsByTeam.mockResolvedValueOnce(comments);
        const data = await commentService.getCommentsByTeam("012345");
        expect(data.response).toBeTruthy();
    });
    test('Getting comments by role but no role provided, should return false', async () => {
        const data = await commentService.getCommentsByRole();
        expect(data.response).toBeFalsy();
    });
    test('Getting comments by role but no comments, should return false', async () => {
        commentDAO.getCommentsByRole.mockResolvedValueOnce([]);
        const data = await commentService.getCommentsByRole("user");
        expect(data.response).toBeFalsy();
    });
    test('Getting comments by role with comments, should return true', async () => {
        const comments = [
            {
                username: "testuser1",
                comment: {
                    team_id: "018965",
                    comment: "test comment 1",
                    rating: 1,
                    timestamp: "date"
                }
            },
            {
                username: "testuser2",
                comment: {
                    team_id: "1465312",
                    comment: "test comment 2",
                    rating: 2,
                    timestamp: "date"
                }
            }
        ];
        commentDAO.getCommentsByRole.mockResolvedValueOnce(comments);
        const data = await commentService.getCommentsByRole("user");
        expect(data.response).toBeTruthy();
    });
});

describe('Posting Comments', () => {
    test('Posting Comment but no data provided, should return false', async () => {
        const data = await commentService.postComment({});
        expect(data.response).toBeFalsy();
    });
    test('Posting Comment but data is incomplete, should return false', async () => {
        const comment = {
            username: "testuser",
            team_id: "146512",
            rating: 3
        }
        const data = await commentService.postComment(comment);
        expect(data.response).toBeFalsy();
    });
    test('Posting comment but user cannot be found, should return false', async () => {
        const comment = {
            username: "testuser",
            team_id: "048651",
            comment: "this is a comment",
            rating: 3
        };
        userDAO.getUserByUsername.mockResolvedValueOnce(null);
        const data = await commentService.postComment(comment);
        expect(data.response).toBeFalsy();
    });
    test('Posting comment but team cannot be found, should return false', async () => {
        const comment = {
            username: "testuser",
            team_id: "0481695",
            comment: "this is a comment",
            rating: 3
        };
        const user = {
            username: "testuser",
            password: "ebnsa5or",
            name: "Test User",
            email: "test@example.com",
            role: "user"
        };
        userDAO.getUserByUsername.mockResolvedValueOnce(user);
        commentDAO.getTeamById.mockResolvedValueOnce(null);
        const data = await commentService.postComment(comment);
        expect(data.response).toBeFalsy();
    });
    test('Posting comment but team was not posted, should return false', async () => {
        const comment = {
            username: "testuser",
            team_id: "046523",
            comment: "this is a comment",
            rating: 3
        };
        const user = {
            username: "testuser",
            password: "ebnsa5or",
            name: "Test User",
            email: "test@example.com",
            role: "user"
        };
        const team = {
            post: false
        }
        userDAO.getUserByUsername.mockResolvedValueOnce(user);
        commentDAO.getTeamById.mockResolvedValueOnce(team);
        const data = await commentService.postComment(comment);
        expect(data.response).toBeFalsy();
    });
    test('Posting comment and team is posted, should return true', async () => {
        const comment = {
            username: "testuser",
            team_id: "048965312",
            comment: "this is a comment",
            rating: 3
        };
        const user = {
            username: "testuser",
            password: "ebnsa5or",
            name: "Test User",
            email: "test@example.com",
            role: "user"
        };
        const team = {
            post: true
        }
        userDAO.getUserByUsername.mockResolvedValueOnce(user);
        commentDAO.getTeamById.mockResolvedValueOnce(team);
        commentDAO.postComment.mockResolvedValueOnce(true);
        const data = await commentService.postComment(comment);
        expect(data.response).toBeTruthy();
    });
});

describe('Updating Comments', () => {
    test('Updating comment but data is empty, should return false', async () => {
        const data = await commentService.updateComment({});
        expect(data.response).toBeFalsy();
    });
    test('Updating comment but not enough data, should return false', async () => {
        const comment = {
            username: "testuser",
            team_id: "01968451",
            comment: "this is a comment",
            rating: 3
        };
        const data = await commentService.updateComment(comment);
        expect(data.response).toBeFalsy();
    });
    test('Updating comment but user cannot be found, should return false', async () => {
        const comment = {
            username: "testuser",
            team_id: "04684532",
            comment: "this is a comment",
            rating: 3,
            comment_index: 0
        };
        userDAO.getUserByUsername.mockResolvedValueOnce(null);
        const data = await commentService.updateComment(comment);
        expect(data.response).toBeFalsy();
    });
    test('Updating comment but team does not exist, should return false', async () => {
        const comment = {
            username: "testuser",
            team_id: "065231",
            comment: "this is a comment",
            rating: 3,
            comment_index: 0
        };
        const user = {
            username: "testuser",
            password: "ebnsa5or",
            name: "Test User",
            email: "test@example.com",
            role: "user"
        };
        userDAO.getUserByUsername.mockResolvedValueOnce(user);
        commentDAO.getTeamById.mockResolvedValueOnce(null);
        const data = await commentService.updateComment(comment);
        expect(data.response).toBeFalsy();
    });
    test('Updating comment but team is not posted, should return false', async () => {
        const comment = {
            username: "testuser",
            team_id: "048965132",
            comment: "this is a comment",
            rating: 3,
            comment_index: 0
        };
        const user = {
            username: "testuser",
            password: "ebnsa5or",
            name: "Test User",
            email: "test@example.com",
            role: "user"
        };
        const team = {
            post: false
        }
        userDAO.getUserByUsername.mockResolvedValueOnce(user);
        commentDAO.getTeamById.mockResolvedValueOnce(team);
        const data = await commentService.updateComment(comment);
        expect(data.response).toBeFalsy();
    });
    test('Updating comment and team is posted, should return true', async () => {
        const comment = {
            username: "testuser",
            team_id: "0865412",
            comment: "this is a comment",
            rating: 3,
            comment_index: 0
        };
        const user = {
            username: "testuser",
            password: "ebnsa5or",
            name: "Test User",
            email: "test@example.com",
            role: "user"
        };
        const team = {
            post: true
        }
        userDAO.getUserByUsername.mockResolvedValueOnce(user);
        commentDAO.getTeamById.mockResolvedValueOnce(team);
        commentDAO.updateComment.mockResolvedValueOnce(true);
        const data = await commentService.updateComment(comment);
        expect(data.response).toBeTruthy();
    });
});

describe('Deleting Comments', () => {
    test('Deleting comments but no data provided, should return false', async () => {
        const data = await commentService.deleteComment();
        expect(data.response).toBeFalsy();
    });
    test('Deleting comments but comment index is invalid, should return false', async () => {
        const data = await commentService.deleteComment("testuser", "index");
        expect(data.response).toBeFalsy();
    });
    test('Deleting comments but user cannot be found, should return false', async () => {
        userDAO.getUserByUsername.mockResolvedValueOnce(null);
        const data = await commentService.deleteComment("testuser", 0);
        expect(data.response).toBeFalsy();
    });
    test('Deleting comments and user found, should return true', async () => {
        const user = {
            username: "testuser",
            password: "ebnsa5or",
            name: "Test User",
            email: "test@example.com",
            role: "user"
        };
        userDAO.getUserByUsername.mockResolvedValueOnce(user);
        commentDAO.deleteComment.mockResolvedValueOnce(true);
        const data = await commentService.deleteComment("testuser", 0);
        expect(data.response).toBeTruthy();
    });
});