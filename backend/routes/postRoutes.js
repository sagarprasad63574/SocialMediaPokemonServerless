const express = require('express');
const router = express.Router();
const { BadRequestError } = require('../util/expressError')

const { ensureLoggedIn, ensureAdmin } = require('../middleware/auth');
const postService = require('../service/postService');

//posts get all posted teams for a all users
router.get('/', ensureLoggedIn, async (req, res, next) => {
    try {
        const { response, message, teams } = await postService.viewAllPostedTeams();

        if (response) {
            return res.status(200).json({
                response,
                message,
                teams
            })
        } else {
            return res.status(200).json({
                message
            })
        }
    } catch (err) {
        return next(err);
    }
});

router.get('/:id', ensureLoggedIn, async (req, res, next) => {
    const team_id = req.params.id;
    try {
        const {response, message, foundTeam} = await postService.viewTeamByIdFromAll(team_id);
        if(response){
            return res.status(200).json({
                response,
                message,
                foundTeam
            });
        } else {
            return res.status(200).json({
                response,
                message
            });
        };
    } catch (error) {
        return next(error);
    }
});

router.post('/:id', ensureLoggedIn, async (req, res, next) => {
    const user_id = res.locals.user.id; 
    const team_id = req.params.id;
    try {
        const {response, message, team} = await postService.postTeam(user_id, team_id);
        if(response){
            return res.status(200).json({
                response,
                message,
                team
            });
        } else {
            return res.status(400).json({
                response,
                message
            });
        };
    } catch (error) {
        return next(error);
    }
});

//posts/:id post a team to homepage
// router.post('/:id', ensureLoggedIn, async (req, res, next) => {
//     const user_id = res.locals.user.id;
//     console.log(user_id)
//     const team_id = req.params.id;

//     try {
//         const { response, message, team } = await postService.postTeam(user_id, team_id);

//         if (response) {
//             return res.status(200).json({
//                 response,
//                 message,
//                 team
//             })
//         } else {
//             return res.status(400).json({
//                 response,
//                 message
//             })
//         }
//     } catch (err) {
//         return next(err);
//     }
// });



module.exports = router; 