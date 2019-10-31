const express = require('express')
const router = express.Router();
const postDB = require('../posts/postDb');

router.get('/', (req, res) => {
    postDB
        .get()
        .then(posts => res.status(200).json(posts))
        .catch(err => res.status(500).json({ error: err }))
});

router.get('/:id', validatePostId, (req, res) => {
    postDB
        .getById(req.params.id)
        .then(post => {
                res.status(200).json(post)
        })
        .catch(err => res.status(500).json({ error: 'Could not find post with ID ' + req.params.id }))
});

router.delete('/:id', validatePostId, (req, res) => {
    postDB
        .remove(req.params.id)
        .then(id => {
            res.status(200).json(id)
        })
        .catch(err => res.status(500).json({ error: err }))
});

router.put('/:id', validatePostId, (req, res) => {
    if (req.body) {
        if (req.body.text) {
            postDB.update(req.params.id, req.body)
                .then(user => {
                    res.status(200).json(user);
                })
                .catch(err => res.status(500).json({ message: err }))
        } else {
            res.status(500).json({ error: err })
        }
    } else {
        res.status(500).json({ error: err })
    }
});

// custom middleware

function validatePostId(req, res, next) {
    if (!isNaN(parseInt(req.params.id))) {
        console.log("valid ID");
        next();
    } else {
        console.log("not a valid ID");
        res.status(500).json({ message: "No id param in request" });
    }
};

module.exports = router;