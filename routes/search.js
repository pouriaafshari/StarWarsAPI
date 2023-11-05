const express = require('express');
const router = express.Router();
const People = require('./Json/people.json');

router.get('/', (req, res) => {
  const searchString = req.query.string;
  const matchingCharacters = [];

  if (!searchString) {
    return res.status(400).json({ message: 'Please provide a search string in the "string" parameter.' });
  }

  const searchStringLower = searchString.toLowerCase();

  People.forEach((person) => {
    if (
      person.name.toLowerCase().includes(searchStringLower) ||
      (typeof person.homeworld === 'string' && person.homeworld.toLowerCase().includes(searchStringLower)) ||
      (person.bornlocation && person.bornlocation.toLowerCase().includes(searchStringLower)) ||
      person.species.toLowerCase().includes(searchStringLower)
    ) {
      matchingCharacters.push(person);
    }
  });

  if (matchingCharacters.length === 0) {
    return res.status(404).json({ message: 'No matching characters found.' });
  }

  const pageSize = 10;
  const totalPages = Math.ceil(matchingCharacters.length / pageSize);

  const page = parseInt(req.query.page) || 1;
  if (page < 1 || page > totalPages) {
    return res.status(400).json({ message: `Invalid page number. The valid range is 1 to ${totalPages}.` });
  }

  const startIndex = (page - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, matchingCharacters.length);

  const pageData = matchingCharacters.slice(startIndex, endIndex);

  if (pageData.length === 0 || pageData.length < pageSize) {
    return res.json(pageData);
  }

  return res.json({
    page: page,
    totalPages: totalPages,
    characters: pageData,
  });
});

module.exports = router;
