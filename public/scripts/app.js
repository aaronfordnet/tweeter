// ** Client-side JS logic - wrapped in jQuery document ready function **

$(document).ready(function () {


  // function deleteTweet(data) {
  //   $.ajax({
  //     method: 'POST',
  //     url: '/delete',
  //     data: data.user.name
  //   })
  //   .done(function (delData) {
  //     console.log('Delete', delData);
  // }



  // CREATE TWEET ARTICLE FROM TEMPLATE
  function createTweetElement(data) {
    let date = moment(data.created_at).fromNow();
    let $article = $('<article>').addClass('tweet').attr('id',`${data._id}`);
    $article.html(`
      <header>
        <img src=${data.user.avatars.small} alt=${data.user.name}>
        <h2>${data.user.name}</h2>
        <p>${data.user.handle}</p>
      </header>
      <section class="tweet-body">
        <p>${escape(data.content.text)}</p>
      </section>
      <footer>
        <p>${date}</p>
        <div class="footer-icons">
          <img class="flag" src="https://png.icons8.com/windows/64/000000/flag.png" alt="flag">
          <img src="https://png.icons8.com/windows/64/000000/available-updates.png">
          <img src="https://png.icons8.com/windows/64/000000/hearts.png">
        </div>
      </footer>
    `);
    return $article;
  };

  // ESCAPE FUNCTION TO PREVENT XSS
  function escape(text) {
    let div = document.createElement('div');
    div.appendChild(document.createTextNode(text));
    return div.innerHTML;
  }

  // RENDER ALL TWEETS IN DATABASE
  function renderTweets(data) {
    for (let tweets in data) {
      let $tweet = createTweetElement(data[tweets]);
      $('#timeline').prepend($tweet);
    }
    $('.flag').on('click', function (event) {
      let $postId = $(event.target).closest('article').attr('id');
      $.ajax({
        type: 'DELETE',
        url: `/tweets/delete/${$postId}`,
        data: $postId,
      }).done(function () {
        $('#timeline').empty();
        loadTweets();
      });
    })
  };

  // POST NEW TWEET
  $('.new-tweet form').on('submit', function (event) {
    event.preventDefault();
    let input = (event.target.elements.text.value).trim();
    let $text = $(this).serialize();
    // Validate tweet length
    $('.new-tweet .error-msg').hide();
    if (validateForm(input)) {
      // fade form and disable submit button until post complete
      $('section.new-tweet').fadeTo(200, 0.5);
      $('section.new-tweet form input[type=submit]').attr('disabled', 'disabled');
      $.ajax({
        type: 'POST',
        url: '/tweets',
        data: $text,
      }).done(function () {
        $('section.new-tweet').fadeTo('fast', 1);
        $('section.new-tweet form input[type=submit]').removeAttr('disabled');
        $('.new-tweet textarea').val('');
        $('section.new-tweet .counter').text('140');
        $('#timeline').empty();
        loadTweets();
      });
    };
  });

  // VALIDATE FORM
  function validateForm(input) {
    if (input.length <= 0) {
      $('.new-tweet .error-msg').slideDown('fast').text(`Bleat can't be empty`);
      return;
    } else if (input.length > 140) {
      $('.new-tweet .error-msg').slideDown('fast').text(`Bleat over 140 characters`);
      return;
    }

    return true;
  }

  //GET TWEETS
  function loadTweets() {
    $.ajax({
      method: 'GET',
      url: '/tweets',
    })
    .done(function (tweets) {
      renderTweets(tweets);
    });
  }

  // COMPOSE BUTTON TOGGLES NEW TWEET FORM
  $('#nav-bar .compose-btn').click(function () {
    $('html, body').animate({ scrollTop: 0 }, 'slow');
    $('section.new-tweet').slideToggle('fast', function () {
      $('section.new-tweet textarea').select();
    });
  });

  loadTweets();

});
