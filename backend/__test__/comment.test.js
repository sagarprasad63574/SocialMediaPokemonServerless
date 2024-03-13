const commentService = require('../service/commentService');
const commentDAO = require('../repository/commentDAO');
const userDAO = require('../repository/userDAO');

jest.mock('../repository/commentDAO');
jest.mock('../repository/userDAO');

describe('Getting comments', () => {
    test('Getting all comments but empty, should return false', async () => {
        commentDAO.getEveryComment.mockResolvedValueOnce([]);
        const data = await commentService.getEveryComment();
        expect(data.response).toBeFalsy();
    });
    test('Getting all comments but comments present, should return true', async () => {
        const commentObjs = [
            {
                username: "testuser1",
                comments: [
                    {
                        team_name: "team_1",
                        comment: "testcomment1"
                    },
                    {
                        team_name: "team_2",
                        comment: "testcomment2"
                    }
                ]
            },
            {
                username: "testuser2",
                comments: [
                    {
                        team_name: "team_1",
                        comment: "testcomment3"
                    }
                ]
            }
        ];
        commentDAO.getEveryComment.mockResolvedValueOnce(commentObjs);
        const data = await commentService.getEveryComment();
        expect(data.response).toBeTruthy();
    });
    test('Getting comments by username but no comments exist, should return false', async () => {
        commentDAO.getCommentsByUsername.mockResolvedValueOnce(null);
        const data = await commentService.getCommentsByUsername("username");
        expect(data.response).toBeFalsy();
    });
    test('Getting comments by username but no user present, should return false', async () => {
        const comments = [
            {
                team_name: "team_1",
                comment: "testcomment1"
            },
            {
                team_name: "team_2",
                comment: "testcomment2"
            }
        ];
        commentDAO.getCommentsByUsername.mockResolvedValueOnce(comments);
        const data = await commentService.getCommentsByUsername();
        expect(data.response).toBeFalsy();
    });
    test('Getting comments by username and comments present, should return true', async () => {
        const comments = [
            {
                team_name: "team_1",
                comment: "testcomment1"
            },
            {
                team_name: "team_2",
                comment: "testcomment2"
            }
        ];
        commentDAO.getCommentsByUsername.mockResolvedValueOnce(comments);
        const data = await commentService.getCommentsByUsername("username");
        expect(data.response).toBeTruthy();
    });
    test('Getting comments by team but empty, should return false', async () => {
        commentDAO.getCommentsByTeam.mockResolvedValueOnce(null);
        const data = await commentService.getCommentsByTeam("team_1");
        expect(data.response).toBeFalsy();
    });
    test('Getting comments by team but no team name, should return false', async () => {
        const commentObjs = [
            {
                username: "testuser1",
                comments: [
                    {
                        team_name: "team_1",
                        comment: "testcomment1"
                    }
                ]
            },
            {
                username: "testuser2",
                comments: [
                    {
                        team_name: "team_1",
                        comment: "testcomment3"
                    }
                ]
            }
        ];
        commentDAO.getCommentsByTeam.mockResolvedValueOnce(commentObjs);
        const data = await commentService.getCommentsByTeam();
        expect(data.response).toBeFalsy();
    });
    test('Getting comments by team with team name, should return true', async () => {
        const commentObjs = [
            {
                username: "testuser1",
                comments: [
                    {
                        team_name: "team_1",
                        comment: "testcomment1"
                    }
                ]
            },
            {
                username: "testuser2",
                comments: [
                    {
                        team_name: "team_1",
                        comment: "testcomment3"
                    }
                ]
            }
        ];
        commentDAO.getCommentsByTeam.mockResolvedValueOnce(commentObjs);
        const data = await commentService.getCommentsByTeam("team_1");
        expect(data.response).toBeTruthy();
    });
    test('Getting comments by role but empty, should return false', async () => {
        commentDAO.getCommentsByRole.mockResolvedValueOnce(null);
        const data = await commentService.getCommentsByRole("user");
        expect(data.response).toBeFalsy();
    });
    test('Getting comments by role but no role, should return false', async () => {
        const commentObjs = [
            {
                username: "testuser1",
                comments: [
                    {
                        team_name: "team_1",
                        comment: "testcomment1"
                    },
                    {
                        team_name: "team_2",
                        comment: "testcomment2"
                    }
                ]
            },
            {
                username: "testuser2",
                comments: [
                    {
                        team_name: "team_1",
                        comment: "testcomment3"
                    }
                ]
            }
        ];
        commentDAO.getCommentsByRole.mockResolvedValueOnce(commentObjs);
        const data = await commentService.getCommentsByRole();
        expect(data.response).toBeFalsy();
    });
    test('Getting comments by role and role provided, should return true', async () => {
        const commentObjs = [
            {
                username: "testuser1",
                comments: [
                    {
                        team_name: "team_1",
                        comment: "testcomment1"
                    },
                    {
                        team_name: "team_2",
                        comment: "testcomment2"
                    }
                ]
            },
            {
                username: "testuser2",
                comments: [
                    {
                        team_name: "team_1",
                        comment: "testcomment3"
                    }
                ]
            }
        ];
        commentDAO.getCommentsByRole.mockResolvedValueOnce(commentObjs);
        const data = await commentService.getCommentsByRole("user");
        expect(data.response).toBeTruthy();
    });
});
describe('Posting comments', () => {
    test('Posting comment but no data, should return false', async () => {
        const data = await commentService.postComment({});
        expect(data.response).toBeFalsy();
    });
    test('Posting comment but incomplete data, should return false', async () => {
        const comment = {
            username: "testuser",
            comment: "test comment"
        };
        const data = await commentService.postComment(comment);
        expect(data.response).toBeFalsy();
    });
    test('Posting comment with complete data but user does not exist, should return false', async () => {
        const comment = {
            username: "testuser",
            team_name: "team1",
            comment: "test comment"
        };
        userDAO.getUserByUsername.mockResolvedValueOnce(null);
        const data = await commentService.postComment(comment);
        expect(data.response).toBeFalsy();
    });
    test('Posting comment and user exists, should return true', async () => {
        const comment = {
            username: "testuser",
            team_name: "team1",
            comment: "test comment"
        };
        const user = {
            username: "testuser",
            password: "ebnsa5or",
            name: "Test User",
            email: "test@example.com",
            role: "user"
        };
        userDAO.getUserByUsername.mockResolvedValueOnce(user);
        commentDAO.postComment.mockResolvedValueOnce(true);
        const data = await commentService.postComment(comment);
        expect(data.response).toBeTruthy();
    });
});
describe('Updating Comments', () => {
    test('Empty data, should return false', async () => {
        const data = await commentService.updateComment({});
        expect(data.response).toBeFalsy();        
    });
    test('Comment data present but incomplete, should return false', async () => {
        const newComment = {
            username: "testuser",
            team_name: "team1",
            comment: "this is a new comment"
        };
        const data = await commentService.updateComment(newComment);
        expect(data.response).toBeFalsy();
    });
    test('Comment data complete but user does not exist, should return false', async () => {
        const newComment = {
            username: "testuser",
            team_name: "team1",
            comment: "this is a new comment",
            comment_index: 0
        };
        userDAO.getUserByUsername.mockResolvedValueOnce(null);
        const data = await commentService.updateComment(newComment);
        expect(data.response).toBeFalsy();
    });
    test('Comment data complete and user exists but index out of range, should return false', async () => {
        const newComment = {
            username: "testuser",
            team_name: "team1",
            comment: "this is a new comment",
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
        commentDAO.updateComment.mockResolvedValueOnce(null);
        const data = await commentService.updateComment(newComment);
        expect(data.response).toBeFalsy();
    });
    test('Comment data complete and index in range, should return true', async () => {
        const newComment = {
            username: "testuser",
            team_name: "team1",
            comment: "this is a new comment",
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
        commentDAO.updateComment.mockResolvedValueOnce(true);
        const data = await commentService.updateComment(newComment);
        expect(data.response).toBeTruthy();
    });
});
