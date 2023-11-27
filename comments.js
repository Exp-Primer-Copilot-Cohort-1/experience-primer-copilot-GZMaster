// Create web server
const express = require('express');
const bodyParser = require('body-parser');
const { randomBytes } = require('crypto');
const cors = require('cors');
const axios = require('axios');
const app = express();
app.use(bodyParser.json());
app.use(cors());

// Create comments object
const commentsByPostId = {};

// Create post request
app.post('/posts/:id/comments', async (req, res) => {
  // Generate random id
  const commentId = randomBytes(4).toString('hex');
  // Get post id
  const { id } = req.params;
  // Get comment from request body
  const { content } = req.body;
  // Get comments from commentsByPostId object
  const comments = commentsByPostId[id] || [];
  // Push new comment to comments object
  comments.push({ id: commentId, content, status: 'pending' });
  // Set comments to commentsByPostId object
  commentsByPostId[id] = comments;
  // Send event to event bus
  await axios.post('http://event-bus-srv:4005/events', {
    type: 'CommentCreated',
    data: { id: commentId, content, postId: id, status: 'pending' },
  });
  // Send response
  res.status(201).send(comments);
});

// Create event endpoint
app.post('/events', async (req, res) => {
  // Get event from request body
  const { type, data } = req.body;
  // Check if event type is CommentModerated
  if (type === 'CommentModerated') {
    // Get post id from event data
    const { postId, id, status, content } = data;
    // Get comments from commentsByPostId object
    const comments = commentsByPostId[postId];
    // Get comment from comments object
    const comment = comments.find((comment) => comment.id === id);
    // Set comment status to event data status
    comment.status = status;
    // Send event to event bus
    await axios.post('http://event-bus-srv:4005/events', {
      type: 'CommentUpdated',
      data: { id, status, postId, content },
    });
  }
  // Send response
  res.send({});
});

// Create get request
app.get('/posts/:id/comments', (req, res ) => {
    // Get post id
    const { id } = req.params;
    // Get comments from commentsByPostId object
    const comments = commentsByPostId[id] || [];
    // Send response
    res.send(comments);
    });
        