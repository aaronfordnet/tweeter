$(document).ready(function() {
  $('.new-tweet textarea').on('input', function() {
    let count = 140 - this.value.length;
    let $counter = $(this).siblings(".counter");
    // Make counter text red if count goes below zero
    count >= 0 ? $counter.text(count).css('color', '#244751') : $counter.text(count).css('color', 'red');
  })
});
