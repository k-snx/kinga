// INSTAGRAM FEED
$( document ).ready(function() {

  
  // ADD YOUR IG ACCESS TOKEN HERE (ig.token) CAN EASILY GET USING ~ http://instagram.pixelunion.net/
var $accessToken = "1944420703.1677ed0.4493c5305c114aa5a098edd023c6f86d";
  // ADD YOUR USER ID HERE ~ THIS IS THE FIRST SECTION OF THE IG TOKEN EG. 1234567890 
var $userID = "1944420703";
    // THE AMMOUNT OF INSTAGRAM IMAGES YOU WANT TO DISPLAY
var $postNumber = "8"
    // THE AMMOUNT OF INSTAGRAM IMAGES YOU WANT TO ADD WITH EACH CLICK
var $nextRow = "4"
console.log($postNumber)

$(".js-instagram__loadButton").on( "click", function() { 
  $postNumber = "4" ;
  jsInstagram();
});
  
  
  function jsInstagram() {
    if($accessToken === '') {

      var $placeholder = "<a class='instagram__placeholder'></a>".repeat($postNumber);
      $(".instagram").append($placeholder);


      $('.instagram__placeholder').css({
        'background-image': 'url("http://placehold.it/500x500")',
        'display': 'inline-block',
        'width': '23.5%',
        'padding-bottom': '23.5%',
        'background-size': 'cover',
        'background-position': '50%',
        'margin-bottom': '2%',
        'overflow': 'hidden',
        'position': 'relative'
      });
    }

    else {

      $('.instagram').attr('data-userid', $userID);
      $('.instagram').attr('data-limit', $postNumber);

      var ig = {}; 
      ig.token = $accessToken;
      ig.init = function() {
        $('.instagram').each(function(i) {
          var args = {};
          args.container = $(this);
          args.userid = args.container.data('userid');
          args.limit = args.container.data('limit');
          args.feedurl = 'https://api.instagram.com/v1/users/'+args.userid+'/media/recent/?access_token='+ig.token+'&count='+args.limit+'&callback=?';
          args.html = '';
          // PASS ARGS TO QUERY
          ig.query(args);
        });
      }

      ig.query = function(args) {
        $.getJSON(args.feedurl, {}, function(data) {
          // PASS QUERY DATA TO BUILDER
          ig.build(data, args);
        });
      }

      ig.build = function(data, args) {

        $.each(data.data,function (i,item) {
          console.log(item);
          
          if (item.caption) var caption = item.caption.text;
          if (item.likes) var likes = item.likes.count;
          
          var thumb = item.images.low_resolution.url;
          var img = item.images.standard_resolution.url;
          //get 1280 size photo [hack until avail in api]
          var hires = img.replace('s640x640', '1080x1080');
          args.html += '<a class="image" style="background-image: url('+thumb+');" data-img="'+hires+'">';
          if (caption) args.html += '<span class="caption">'+caption+'</span>';
          if (likes) args.html += '<span class="likes">'+likes+'</span>'; 
          args.html += '</a>';
          // PASS TO OUTPUT
          ig.output(args);
        });
      }

      ig.output = function(args) {
        args.container.html(args.html);
      }

      ig.view = {
        viewer: $('.igviewer'),
        image: $('.igviewer img'),
        open: function(img) {
          ig.view.viewer.removeClass('hidden');
          ig.view.image.attr('src', img);
        },
        close: function() {
          ig.view.viewer.addClass('hidden');
          ig.view.image.attr('src', '');
        }
      }
      ig.init();
    }
  }

  jsInstagram();
});

