const router = require('express').Router();
let User = require('../models/user.model');

// get specific user info from db
router.route('/').get((req,res) => {
    User.find()
        .then(user => res.json(user))
        .catch(err => res.status(400).json('Error: ' + err));
});

// get specific user info from db
router.route('/:email').get((req,res) => {
    User.findOne({username: req.params.email})
        .then(user => res.json(user))
        .catch(err => res.status(400).json('Error: ' + err));
});

// get specific user info from db
router.route('/:email/courses').get((req,res) => {
    User.findOne({username: req.params.email})
        .then(user => res.json(user.itinerary))
        .catch(err => res.status(400).json('Error: ' + err));
});

// get specifically Monday courses info from user
router.route('/:email/courses/M').get((req,res) => {
    User.findOne({username: req.params.email})
        .then(user => {
            res.json(
                user.itinerary.filter(function(course) {
                    if (course.days.M === true) {
                        return course;
                    }
                })
            );
        })
        .catch(err => res.status(400).json('Error: ' + err));
});

// get specifically Tuesday courses info from user
router.route('/:email/courses/T').get((req,res) => {
    User.findOne({username: req.params.email})
        .then(user => {
            res.json(
                user.itinerary.filter(function(course) {
                    if (course.days.T === true) {
                        return course;
                    }
                })
            );
        })
        .catch(err => res.status(400).json('Error: ' + err));
});

// get specifically Wednesday courses info from user
router.route('/:email/courses/W').get((req,res) => {
    User.findOne({username: req.params.email})
        .then(user => {
            res.json(
                user.itinerary.filter(function(course) {
                    if (course.days.W === true) {
                        return course;
                    }
                })
            );
        })
        .catch(err => res.status(400).json('Error: ' + err));
});

// get specifically Thursday courses info from user
router.route('/:email/courses/R').get((req,res) => {
    User.findOne({username: req.params.email})
        .then(user => {
            res.json(
                user.itinerary.filter(function(course) {
                    if (course.days.R === true) {
                        return course;
                    }
                })
            );
        })
        .catch(err => res.status(400).json('Error: ' + err));
});

// get specifically Friday courses info from user
router.route('/:email/courses/F').get((req,res) => {
    User.findOne({username: req.params.email})
        .then(user => {
            res.json(
                user.itinerary.filter(function(course) {
                    if (course.days.F === true) {
                        return course;
                    }
                })
            );
        })
        .catch(err => res.status(400).json('Error: ' + err));
});

// get specifically Saturday courses info from user
router.route('/:email/courses/Sa').get((req,res) => {
    User.findOne({username: req.params.email})
        .then(user => {
            res.json(
                user.itinerary.filter(function(course) {
                    if (course.days.Sa === true) {
                        return course;
                    }
                })
            );
        })
        .catch(err => res.status(400).json('Error: ' + err));
});

// get specifically Sunday courses info from user
router.route('/:email/courses/Su').get((req,res) => {
    User.findOne({username: req.params.email})
        .then(user => {
            res.json(
                user.itinerary.filter(function(course) {
                    if (course.days.Su === true) {
                        return course;
                    }
                })
            );
        })
        .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/:email/exists').get((req,res) => {
    User.countDocuments({username: req.params.email}, function (err, count) {
        if (count === 0) {
            const username = req.params.email;
            const bio = "Hello World!";
            const itinerary = [];

            const newUser = new User({username, bio, itinerary});

            newUser.save()
                .then(() => res.json('User created!'))
                .catch(err => res.status(400).json('Error: ' + err));
        }
        else {
            res.json('User exists')
        }
    })
});

// add a new course to db
router.route('/:email/update-bio').post((req,res) => {
    User.findOne({username: req.params.email})
        .then(user => {
            user.bio = req.body.bio
        
            user.save()
                .then(() => res.json('Bio updated!'))
                .catch(err => res.status(400).json('Error: ' + err));
        })
        .catch(err => res.status(400).json('Error: ' + err)); // throws if post was not foun
}); // end add func

// add a course from db
router.route('/:email/add-course').post((req,res) => {
    User.findOne({username: req.params.email})
        .then(user => {
            const course = {
                title: req.body.title,
                location: req.body.location,
                days: req.body.days,
                start: req.body.start,
                end: req.body.end,
            }
            
            user.itinerary.push(course);
            user.numCourses = user.itinerary.length;

            // saving updated post
            user.save()
                .then(() => res.json('Course added'))
                .catch(err => res.status(400).json('Error: ' + err)); //throws if not all params filled
        })
        .catch(err => res.status(400).json('Error: ' + err)); // throws if post was not found

}); // end add func

// add a course from db
router.route('/:email/delete-course/:id').delete((req,res) => {
    User.findOne({username: req.params.email})
        .then(user => {
            var removeIndex = user.itinerary.map(course => {return course._id;}).indexOf(req.params.id);
            //remove the comment
            user.itinerary.splice(removeIndex, 1);
            user.numCourses = user.itinerary.length;

            // saving updated post
            user.save()
                .then(() => res.json('Course deleted'))
                .catch(err => res.status(400).json('Error: ' + err)); //throws if not all params filled
        })
        .catch(err => res.status(400).json('Error: ' + err)); // throws if post was not found

}); // end add func

module.exports = router;