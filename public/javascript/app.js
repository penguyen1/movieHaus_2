$(document).ready(()=> {
  var $container = $('#container');
  // render homepage on load
  renderHome();

  /* Render functions */
  function renderHome() {
    $.get('/theatres')
    .done((data)=> {
      $container.empty();
      $container.append($('<div>').addClass('row'));
      $('.row').append($('<div>').attr('id', 'theatre-container').addClass('five columns'));
      $('.row').append($('<div>').attr('id', 'movie-container').addClass('five columns'));

      var $theatresContainer = $('#theatre-container');
      for (var i = 0; i < data.length; i++) {
        var div = $('<div>').addClass('theatre').attr('id', 't'+ data[i].theatre_id).text(data[i].name);
        $theatresContainer.append(div);
      }
      theatreEvent();
    })
  }

  function renderProfile(data, tid) {
    $container.empty();

    $container.append($('<div>').attr('id', 'profile-container'));
    $container.append($('<div>').attr('id', 'profile-img'));
    $('#profile-container').append($('<h2>').text(data.title + ' (' + data.year + ')'));
    $('#profile-container').append($('<p>').text('Rating: ' + data.rating));
    $('#profile-container').append($('<p>').text('Directors: ' + data.director));
    $('#profile-container').append($('<p>').text('Actors: ' + data.actors));
    $('#profile-container').append($('<p>').text('Plot: ' + data.plot));
    $('#profile-img').append(`<img src=${data.img_url}>`);

    $('#profile-container').append($('<button>').text('Edit').attr('id', 'edit'));
    $('#edit').click((event)=> {
      editMovie(data, tid);
    })
    $('#profile-container').append($('<button>').text('Delete').attr('id', 'delete'));
    $('#delete').click((event)=> {
      removeMovie();
    })          
  }



  /* Event functions */
  function theatreEvent() {
    $('.theatre').click((event)=> {
      var tid = event.target.id;
      tid = tid.slice(1);

      $.get('/theatres/' + tid)
      .done((data)=> {
        $('#movie-container').empty();
        var $moviesContainer = $('#movie-container');

        var h2 = $('<h2>').text('Movie List');
        var ul = $('<ul>');
        $moviesContainer.append(h2);
        data.forEach((el) => {
          var li = $('<li>').text(el.title + ': ' + el.showtimes.split(',').join(' & ')).attr('id', 'm'+el.movie_id).addClass('movie');
          ul.append(li);
        });
        $moviesContainer.append(ul);
        movieEvent(tid);
      })
    })
  }

  function movieEvent(tid) {
    $('.movie').click((event)=> {
      var mid = event.target.id;
      mid = mid.slice(1);

      $.get('/movies/' + mid)
      .done((data)=> {
        // paint profile page
        renderProfile(data, tid);
      })
    })
  }

  function editMovie(data, tid) {
    $('#profile-container').empty()
    .append(
        `<div id="edit-container">`);
      $('#edit-container').append(
        `<form id="editForm">`);
      $('#editForm').append(
        `<input type="text" name="title" placeholder="${data.title}">`,
        `<input type="int" name="year" placeholder="${data.year}">`,
        `<input type="int" name="rating" placeholder="${data.rating}">`,
        `<input type="text" name="director" placeholder="${data.director}">`,
        `<input type="text" name="plot" placeholder="${data.plot}">`,
        `<input type="text" name="actors" placeholder="${data.actors}">`,
        `<input type="hidden" name="img_url" value="${data.img_url}">`,
        `<input type="hidden" name="tid" value="${tid}">`,
        `<input type="hidden" name="mid" value="${data.movie_id}">`,
        '<input type="submit" value="Edit">'
      );
    submitEdit(data);
  }

  function submitEdit(data) {
    var mid = data.movie_id;

    $('#editForm').submit((event) => {
      event.preventDefault();

      console.log();
      $.ajax({
        url: '/movies/'+ mid, 
        type: 'PUT',
        data: $('#editForm').serialize()
      })
      .done( (data) => {
        console.log(data);
        renderProfile(data);
      })
    });

  }
  
  // function removeMovie() {
  //   //need to grab movie id(mid)
  //   $.ajax('/movies/' + mid, {
  //     type: DELETE
  //   })
  //   .done(data)=> {
  //
  //   }
  // }







  /* Nav-bar */
  $('#home').click((event) => {
    renderHome();
  });

  $('#searchForm').submit((event) => {
    event.preventDefault();
    $container.empty();

    var title = event.target[0].value;
    $.get('http://www.omdbapi.com/?s=' + title) // need to request again using id for more detail
    .done( (data) => {
      console.log(data);
    });
  });
})
