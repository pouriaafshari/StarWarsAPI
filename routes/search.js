const express = require('express');
const router = express.Router();
const People = require('./Json/people.json');

router.post('/', (req, res) => {
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
  } else {
    return res.json(matchingCharacters);
  }
});

module.exports = router;