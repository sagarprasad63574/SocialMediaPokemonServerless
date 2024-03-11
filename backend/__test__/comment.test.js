const commentService = require('../service/commentService');
const commentDAO = require('../repository/commentDAO');

jest.mock('../repository/commentDAO');

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
    
});
