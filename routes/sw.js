const express = require('express');
const router = express.Router();
const People = require('./Json/people.json');

router.get('/', (req, res) => { 
  const page = parseInt(req.query.page);
  const itemsPerPage = 10; // Number of items to return per page
  const totalCharacters = People.length;

  if (isNaN(page) || page < 1) {
    return res.status(400).json({ message: 'Please provide a valid positive page number.' });
  }

  const maxPage = Math.ceil(totalCharacters / itemsPerPage);
  if (page > maxPage) {
    return res.status(400).json({ message: `Page number exceeds the maximum of ${maxPage}.` });
  }

  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalCharacters);

  const pageData = People.slice(startIndex, endIndex);

  if (pageData.length === 0) {
    return res.status(404).json({ message: 'No data found for the specified page.' });
  } else {
    return res.json(pageData);
  }
});

module.exports = router;