var pgp     = require('pg-promise')({});
var cn = {
  host: 'localhost',
  port: 5432,
  database: 'moviehaus2',
  user: process.env.DB_USER,
  password: process.env.DB_PASS
}
var db      = pgp(cn);

// show all theatres in theatres table
function showTheatres(req,res,next){
  db.many("SELECT * FROM theatres;")
    .then(function(data){
      console.log(data);    // should get multiple theatre names
      res.rows = data;
      next();
    })
    .catch(function(){
      console.log('ERROR in showing ALL THEATRES!');
    })
}

// show all movies in the theatre
// get all movie_id from theatres_movies_join table where theatre_id=($1)
function showTheatreMovie(req,res,next){
  // var tID = req.params.id;
  db.many("SELECT * FROM movies m " + 
          "INNER JOIN theatre_movie_showtime tms " + 
          "ON m.movie_id = tms.movie_id " + 
          "WHERE tms.theatre_id = ($1);", [req.params.id])
    .then(function(data){
      console.log(data);  // should get multiple movies in a theatre
      res.rows = data;
      next();
    })
    .catch(function(){
      console.log('ERROR in showing ALL MOVIES IN A THEATRE!');
    })
}

// get all info of a movie
function getMovie(req,res,next){
  // var mID = req.params.id;
  db.one("SELECT * FROM movies WHERE movie_id=($1);", [req.params.id])
    .then(function(data){
      console.log(data);  // should get all info of a movie
      res.rows = data;
      next();
    })
    .catch(function(){
      console.log('ERROR in getting MOVIE DETAILS!');
    })
}

// 1- add movie to movies table 
// 2- get last movie_id
// 3- (iterate) add each showTime to theatre_movie_showtime WHERE movie_id AND theatre_id
function addMovie(req,res,next){}

// edit movie_id info in movies table
function editMovie(req,res,next){
  // var mID = req.params.id;
  db.none("UPDATE movies SET title=($1), year=($2), rating=($3), director=($4), " +
          "plot=($5), actors=($6) WHERE movie_id=($7);",
          [req.body.title, req.body.year, req.body.rating, req.body.director, req.body.plot, req.body.actors, req.params.id])
    .then(function(){
      console.log('UPDATE COMPLETED!');     // testing status for UPDATE
      next();
    })
    .catch(function(){
      console.log('ERROR in editing MOVIE DETAILS!');
    })
}

// delete from theatre_movie_showtime where movie_id=($1) and theatre_id=($2);
function deleteMovie(req,res,next){
  // var mID = req.params.id;
  db.none("DELETE FROM theatre_movie_showtime WHERE movie_id=($1) AND theatre_id=($2);",
          [req.params.mID, req.params.tID])   // how do we differentiate btw movie_id & theatre_id ??
    .then(function(){
      console.log('DELETE COMPLETED!');     // testing status for DELETE
      next();
    })
    .catch(function(){
      console.log('ERROR in getting MOVIE DETAILS!');
    })
}

module.exports.showTheatres = showTheatres;
module.exports.showTheatreMovie = showTheatreMovie;
module.exports.getMovie = getMovie;
module.exports.addMovie = addMovie;
module.exports.editMovie = editMovie;
module.exports.deleteMovie = deleteMovie;




