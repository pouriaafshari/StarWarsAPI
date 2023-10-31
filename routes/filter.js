const express = require('express');
const router = express.Router();
const People = require('./Json/people.json');
const Films = require('./Json/films.json')

router.get('/species/:name', (req, res) => {
  const speciesName = req.params.name;
  const matchingPeople = People.filter(person => person.species.toLowerCase() === speciesName.toLowerCase());

  if (matchingPeople.length === 0) {
    res.status(404).json({ message: 'No people with the specified species found.' });
  } else {
    res.json(matchingPeople);
  }
});

router.get('/planet/:name', (req, res) => {
    const planetName = req.params.name;
    const matchingPeople = People.filter(person => {
      if (typeof person.homeworld === 'string') {
        return person.homeworld.toLowerCase() === planetName.toLowerCase();
      } else if (Array.isArray(person.homeworld)) {
        // Check each string in the array
        return person.homeworld.some(hw => hw.toLowerCase() === planetName.toLowerCase());
      }
      return false; // Skip items with non-string homeworld
    });
  
    if (matchingPeople.length === 0) {
      res.status(404).json({ message: 'No people from the specified planet found.' });
    } else {
      res.json(matchingPeople);
    }
  });

  router.get('/film/:name', (req, res) => {
    const filmName = req.params.name;
  
    // Find the film with the specified title
    const film = Films.find(f => f.fields.title.toLowerCase() === filmName.toLowerCase());
  
    if (!film) {
      res.status(404).json({ message: 'Film not found.' });
      return;
    }
  
    // Get the character IDs from the film's "characters" field
    const characterIds = film.fields.characters;
  
    // Find people whose ID is in the characterIds array
    const matchingPeople = People.filter(person => characterIds.includes(person.id));
  
    if (matchingPeople.length === 0) {
      res.status(404).json({ message: 'No people from the specified film found.' });
    } else {
      res.json(matchingPeople);
    }
  });  

module.exports = router;
