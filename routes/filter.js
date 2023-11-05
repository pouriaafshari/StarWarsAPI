const express = require('express');
const router = express.Router();
const People = require('./Json/people.json');
const Films = require('./Json/films.json');

router.get('/', (req, res) => {
  const { planet, species, film } = req.query;
  let matchingPeople = [...People];

  if (planet) {
    matchingPeople = matchingPeople.filter((person) => {
      if (typeof person.homeworld === 'string') {
        return person.homeworld.toLowerCase() === planet.toLowerCase();
      } else if (Array.isArray(person.homeworld)) {
        // Check each string in the array
        return person.homeworld.some((hw) => hw.toLowerCase() === planet.toLowerCase());
      }
      return false; // Skip items with non-string homeworld
    });
  }

  if (species) {
    matchingPeople = matchingPeople.filter((person) => person.species.toLowerCase() === species.toLowerCase());
  }

  if (film) {
    const matchingFilm = Films.find((f) => f.fields.title.toLowerCase() === film.toLowerCase());

    if (!matchingFilm) {
      return res.status(404).json({ message: 'Film not found.' });
    }

    const characterIds = matchingFilm.fields.characters;
    matchingPeople = matchingPeople.filter((person) => characterIds.includes(person.id));
  }

  if (matchingPeople.length === 0) {
    return res.status(404).json({ message: 'No matching characters found.' });
  }

  const pageSize = 10;
  const totalPages = Math.ceil(matchingPeople.length / pageSize);

  const page = parseInt(req.query.page) || 1;
  if (page < 1 || page > totalPages) {
    return res.status(400).json({ message: `Invalid page number. The valid range is 1 to ${totalPages}.` });
  }

  const startIndex = (page - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, matchingPeople.length);

  const pageData = matchingPeople.slice(startIndex, endIndex);

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