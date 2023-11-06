const express = require('express');
const router = express.Router();
const People = require('./Json/people.json');
const Films = require('./Json/films.json')

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
  const pages = [];
  let count = matchingPeople.length
  pages.push({"Count": count})

  for (let page = 1; page <= totalPages; page++) {
    const startIndex = (page - 1) * pageSize;
    const endIndex = Math.min(startIndex + pageSize, matchingPeople.length);
    const pageData = matchingPeople.slice(startIndex, endIndex);
    pages.push(pageData);
  }

  return res.json(pages);
});

module.exports = router;
