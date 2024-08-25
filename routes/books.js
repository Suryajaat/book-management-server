const express = require('express');
const { check, validationResult } = require('express-validator');
const Book = require('../models/Book');
const auth = require('../middleware/auth');
const router = express.Router();

// @route    GET /api/books
// @desc     Get all books
// @access   Public
router.get('/', auth, async (req, res) => {
  try {
    const books = await Book.find();
    res.json(books);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// @route    POST /api/books
// @desc     Add a new book
// @access   Private
router.post(
  '/',
  [auth, [check('title', 'Title is required').not().isEmpty(), check('author', 'Author is required').not().isEmpty()]],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, author } = req.body;

    try {
      const newBook = new Book({ title, author });
      const book = await newBook.save();
      res.json(book);
    } catch (err) {
      res.status(500).send('Server Error');
    }
  }
);

module.exports = router;
