const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');
const MOVIEDEX = require('./moviedex.json');

const app = express();

app.use(morgan('dev'));
app.use(helmet());
app.use(cors());

app.use(function validateBearerToken(req, res, next) {
    const apiToken = process.env.API_Token;
    const authToken = req.get('Authorization');

    if (!authToken || authToken.split(' ')[1] !== apiToken) {
        return res.status(401).json({ error: 'Unauthorized request' });
      }
    next();
});
  

app.get('/movie', function handleGetMovies(req, res) {
    let response = MOVIEDEX.movies;

    if (req.query.genre) {
        response = response.filter(movie => movie.genre.toLowerCase().includes(req.query.genre.toLowerCase()));
    }

    if (req.query.country) {
        response = response.filter(movie => movie.country.toLowerCase().includes(req.query.country.toLowerCase()));
    }

    if(req.query.avg_vote) {
        let average_vote = parseInt(req.query.avg_vote);
    
        response = response.filter(movie => movie.avg_vote >= average_vote);
    }

    res.json(response);
});






const PORT = 8000;
  
app.listen(PORT, () => {
    console.log(`Server listening at http://localhost:${PORT}`)
});