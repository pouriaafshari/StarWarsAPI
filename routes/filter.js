const express = require('express');
const router = express.Router();
const People = require('./Json/people.json');
const Films = require('./Json/films.json');

router.post('/', (req, res) => {
  const { planet, film, species } = req.body;

  if (!planet && !film && !species) {
    return res.status(400).json({ message: 'Please provide at least one search parameter: planet, film, or species.' });
  }

  let matchingPeople = People;

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

  if (film) {
    const matchingFilm = Films.find((f) => f.fields.title.toLowerCase() === film.toLowerCase());

    if (!matchingFilm) {
      return res.status(404).json({ message: 'Film not found.' });
    }

    const characterIds = matchingFilm.fields.characters;

    matchingPeople = matchingPeople.filter((person) => characterIds.includes(person.id));
  }

  if (species) {
    matchingPeople = matchingPeople.filter((person) => person.species.toLowerCase() === species.toLowerCase());
  }

  if (matchingPeople.length === 0) {
    return res.status(404).json({ message: 'No matching characters found.' });
  } else {
    return res.json(matchingPeople);
  }
});

module.exports = router;