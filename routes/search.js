const express = require('express');
const router = express.Router();
const People = require('./Json/people.json');

router.get('/', (req, res) => {
  const searchString = req.query.string;
  const searchPage = req.query.page;
  const matchingCharacters = [];

  if (!searchString) {
    return res.status(400).json({ message: 'Please provide a search string in the "string" parameter.' });
  }

  const searchStringLower = searchString.toLowerCase();

  People.forEach((person) => {
    if (
      person.name.toLowerCase().includes(searchStringLower)
    ) {
      matchingCharacters.push(person);
    }
  });

  if (matchingCharacters.length === 0) {
    return res.status(404).json({ message: 'No matching characters found.' });
  }

  const pageSize = 10;
  const totalPages = Math.ceil(matchingCharacters.length / pageSize);
  const pages = [];
  let count = matchingCharacters.length;

  for (let page = 1; page <= totalPages; page++) {
    const startIndex = (page - 1) * pageSize;
    const endIndex = Math.min(startIndex + pageSize, matchingCharacters.length);
    const pageData = matchingCharacters.slice(startIndex, endIndex);
    pages.push(pageData);
  }

  const thePage = {
    count: count,
    result: pages[searchPage - 1]
  };

  return res.json(thePage);
});

module.exports = router;
