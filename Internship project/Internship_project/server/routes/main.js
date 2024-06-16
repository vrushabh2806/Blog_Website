const express = require('express');
const Post = require('../models/Post'); // Ensure this path is correct

const router = express.Router();

// Define your routes here
router.get('/', async (req, res) => {
    try {
        const locals = {
            title: "NodeJs Blog",
            description: "Simple Blog created with NodeJs, Express & MongoDb."
        };

        console.log(locals);
        let perPage = 10;
        let page = req.query.page || 1;

        const data = await Post.aggregate([{ $sort: { createdAt: -1 } }])
            .skip(perPage * (page - 1))
            .limit(perPage);

        console.log(data);
        const count = await Post.countDocuments({});
        console.log(count);
        const nextPage = parseInt(page) + 1;

        console.log(nextPage);
        const hasNextPage = nextPage <= Math.ceil(count / perPage);

        console.log(hasNextPage);
       
        res.render("index.ejs", {data});

    } catch (error) {
        console.log(error);
        res.status(500).send("Internal Server Error");
    }
});

const insertPostData = async () => {
    try {
        const count = await Post.countDocuments();
        if (count === 0) {
            await Post.insertMany([
                {
                    title: "Building APIs with Node.js",
                    body: "Learn how to use Node.js to build RESTful APIs using frameworks like Express.js"
                },
                {
                    title: "Deployment of Node.js applications",
                    body: "Understand the different ways to deploy your Node.js applications, including on-premises, cloud, and container environments..."
                },
                {
                    title: "Authentication and Authorization in Node.js",
                    body: "Learn how to add authentication and authorization to your Node.js web applications using Passport.js or other authentication libraries."
                },
                {
                    title: "Understand how to work with MongoDB and Mongoose",
                    body: "Understand how to work with MongoDB and Mongoose, an Object Data Modeling (ODM) library, in Node.js applications."
                },
                {
                    title: "Build real-time, event-driven applications in Node.js",
                    body: "Socket.io: Learn how to use Socket.io to build real-time, event-driven applications in Node.js."
                },
                {
                    title: "Discover how to use Express.js",
                    body: "Discover how to use Express.js, a popular Node.js web framework, to build web applications."
                },
                {
                    title: "Asynchronous Programming with Node.js",
                    body: "Explore the asynchronous nature of Node.js and how it allows for non-blocking I/O operations."
                },
                {
                    title: "Learn the basics of Node.js and its architecture",
                    body: "Learn the basics of Node.js and its architecture, how it works, and why it is popular among developers."
                },
                {
                    title: "NodeJs Limiting Network Traffic",
                    body: "Learn how to limit network traffic."
                },
                {
                    title: "Learn Morgan - HTTP Request logger for NodeJs",
                    body: "Learn Morgan."
                },
            ]);
            console.log('Sample posts inserted.');
        } else {
            console.log('Sample posts already inserted.');
        }
    } catch (error) {
        console.error('Error inserting sample posts:', error);
    }
};

router.get('/post/:id', async (req, res) => {
    try {
        const postId = req.params.id;
        const data = await Post.findById(postId);

        if (!data) {
            return res.status(404).send('Post not found');
        }

        const locals = {
            title: data.title,
            description: "Simple Blog created with NodeJs, Express & MongoDb.",
        };

        res.render('post', {
            locals,
            data,
            currentRoute: `/post/${postId}`
        });
    } catch (error) {
        console.log(error);
        res.status(500).send("Internal Server Error");
    }
});

insertPostData();

router.post('/search', async (req, res) => {
  try {
      const locals = {
          title: "Search",
          description: "Simple Blog created with NodeJs, Express & MongoDb."
      };

      let searchTerm = req.body.searchTerm;
      const searchNoSpecialChar = searchTerm.replace(/[^a-zA-Z0-9 ]/g, "");

      const data = await Post.find({
          $or: [
              { title: { $regex: new RegExp(searchNoSpecialChar, 'i') } },
              { body: { $regex: new RegExp(searchNoSpecialChar, 'i') } }
          ]
      });

      console.log('Search results:', data);

      res.render('partials/search', {
          data: Array.isArray(data) ? data : [],
          locals,
          searchTerm,
          currentRoute: '/'
      });

  } catch (error) {
      console.log(error);
      res.status(500).send("Internal Server Error");
  }
});



router.get('/about', (req, res) => {
    res.render('about');
});

module.exports = router;
