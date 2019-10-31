const express = require('express')
const userDB = require('./userDb');
const postDB = require('../posts/postDb');
const router = express.Router();

router.post('/', validateUser, (req, res) => {
    userDB
        .insert(req.body)
        .then(user => { res.status(200).json(user) })
        .catch(err => res.status(500).json({ error: err }))
});

router.post('/:id/posts', validateUserId, validatePost, (req, res) => {
    postDB
        .insert({user_id: req.params.id, text: req.body.text})
        .then(post => res.status(200).json(post))
        .catch(err => res.status(500).json({ error: err }))
});

router.get('/', (req, res) => {
    userDB
        .get()
        .then(users => res.status(200).json(users))
        .catch(err => res.status(500).json({ error: err }))
});

router.get('/:id', validateUserId, (req, res) => {
    userDB
        .getById(req.params.id)
        .then(user => {
            if (user) {
                res.status(200).json(user)
            } else {
                res.status(404).json({ error: 'Could not find user with ID ' + req.params.id })
            }
        })
        .catch(err => res.status(500).json({ error: err }))
});

router.get('/:id/posts', validateUserId, (req, res) => {
    userDB
        .getUserPosts(req.params.id)
        .then(posts => {
            if (posts) {
                res.status(200).json(posts)
            } else {
                res.status(404).json({ error: 'Could not find posts associated with user ID ' + req.params.id })
            }
        })
        .catch(err => res.status(500).json({ error: err }))
});

router.delete('/:id', validateUserId, (req, res) => {

    userDB.remove(req.params.id)
        .then(user => res.status(200).json(user))
        .catch(err => res.status(404).json({ error: 'Error deleting user. Does user with ID ' + req.params.id + ' exist in the DB?' }))

});

router.put('/:id', validateUserId, validateUser, (req, res) => {
        userDB.update(req.params.id, req.body)
            .then(user => {
                res.status(200).json(user);
            })
            .catch(err => res.status(500).json({message: err}))
});

//custom middleware

function validateUserId(req, res, next) {
    if (req.params.id && !isNaN(parseInt(req.params.id))) {
        next();
    } else {
        res.status(500).json({ message: "No id param in request" });
    }
};

function validateUser(req, res, next) {
    if (req.body) {
        if (req.body.name) {
            next();
        } else {
            res.status(500).json({ message: "must send a name" });
        }
    } else {
        res.status(500).json({ message: "must send body data" });
    }
};

function validatePost(req, res, next) {
    if (req.body) {
        if (req.body.text) {
            next();
        } else {
            res.status(500).json({ message: "must send post text" });
        }
    } else {
        res.status(500).json({ message: "must send body data" });
    }
};

module.exports = router;
