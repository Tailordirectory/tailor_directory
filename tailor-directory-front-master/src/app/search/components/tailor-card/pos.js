var map;

google.maps.event.addDomListener(window, "load", function () {


  var map = new google.maps.Map(document.getElementById("map-div"), {
    center: new google.maps.LatLng(33.808678, -117.918921),
    zoom: 14,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  });

  $('.ic-close').bind('click', function () {
    $(this).parents('.tailor-card-card').css('display', 'none');
  });

  $('#map-hover-card').bind('mouseover', function () {
    $(this).css('display', 'block');
  });

  $('#map-hover-card').bind('mouseout', function () {
    $(this).css('display', 'none');
  });

  function createMarker(options) {
    var marker = new google.maps.Marker(options);
    google.maps.event.addListener(marker, "click", function () {
      var pos = this.getPosition();
      var p = projection.fromLatLngToContainerPixel(pos);
      positionCard($('#map-click-card'), {
        positionOptions: {
          offset: 65,
          markerSize: {
            width: 22,
            height: 42
          },
          clickedCoordinates: {
            yContainer: p.y,
            xContainer: p.x
          },
          containerSize: {
            wContainer: $('#map-div').width(),
            hContainer: $('#map-div').height(),
            offsetTop: $('#map-div').offset().top,
            offsetLeft: $('#map-div').offset().left
          }
        }
      });
      //$('#map-click-card').css('top', p.y + 20);
      //$('#map-click-card').css('left', p.x + 20);
      $('#map-click-card').css('display', 'block');
    });

    google.maps.event.addListener(marker, "mouseover", function () {
      var pos = this.getPosition();
      var p = projection.fromLatLngToContainerPixel(pos);
      positionCard($('#map-hover-card'), {
        positionOptions: {
          offset: 65,
          markerSize: {
            width: 22,
            height: 42
          },
          clickedCoordinates: {
            yContainer: p.y,
            xContainer: p.x
          },
          containerSize: {
            wContainer: $('#map-div').width(),
            hContainer: $('#map-div').height(),
            offsetTop: $('#map-div').offset().top,
            offsetLeft: $('#map-div').offset().left
          }
        }
      });
      //$('#map-hover-card').css('top', p.y + 20);
      //$('#map-hover-card').css('left', p.x + 20);
      $('#map-hover-card').css('display', 'block');
    });

    google.maps.event.addListener(marker, "mouseout", function () {
      $('#map-hover-card').css('display', 'none');
    });

    return marker;
  }

  var marker00 = createMarker({
    position: new google.maps.LatLng(33.808678, -117.918921),
    map: map,
    icon: {
      url: 'http://www.piratespress.com/wp-content/uploads/2016/06/bullet-point-10x10.png',
      scaledSize: new google.maps.Size(2, 2)
    }
  });

  var marker0 = createMarker({
    position: new google.maps.LatLng(33.808678, -117.918921),
    map: map
  });

  var marker1 = createMarker({
    position: new google.maps.LatLng(33.818038, -117.928492),
    map: map
  });

  var marker2 = createMarker({
    position: new google.maps.LatLng(33.803333, -117.915278),
    map: map
  });

  var map;
  MyOverlay.prototype = new google.maps.OverlayView();
  MyOverlay.prototype.onAdd = function () {
  }
  MyOverlay.prototype.onRemove = function () {
  }
  MyOverlay.prototype.draw = function () {
  }

  function MyOverlay(map) {
    this.setMap(map);
  }

  var overlay = new MyOverlay(map);
  var projection;

  google.maps.event.addListener(map, 'bounds_changed', function () {
    projection = overlay.getProjection();
    closeCard();
  });
});

function closeCard() {
  $('#map-click-card').css('display', 'none');
}

function positionCard($element, options, boundaries) {
  var cardWidth = $element.width(),
    cardHeight = $element.height(),
    cardWidthMiddle = cardWidth / 2,
    cardHeightMiddle = cardHeight / 2,
    markerWidth = options.positionOptions.markerSize.width,
    markerHeight = options.positionOptions.markerSize.height,
    offset = options.positionOptions.offset,
    yClick = options.positionOptions.clickedCoordinates.yContainer,
    xClick = options.positionOptions.clickedCoordinates.xContainer,
    xPage = options.positionOptions.containerSize.wContainer,
    yPage = options.positionOptions.containerSize.hContainer,
    containerOffsetTop = options.positionOptions.containerSize.offsetTop,
    containerOffsetLeft = options.positionOptions.containerSize.offsetLeft,
    tailSize = 10,
    xPos, yPos;

  boundaries = boundaries || {
    right: 0,
    bottom: 0
  };

  // wipe out the tail if any
  $element.removeClass('bottom-tail')
    .removeClass('top-tail')
    .removeClass('left-tail')
    .removeClass('right-tail');

  /* logic:
      - Default: Center card above the pin vertically and horizontally
      - would card top be less than 0? Yes, position below pin and center horizontally
      - would card right be past the right map boundary? Yes, position to left of pin and center vertically
      - would card left be less than left map boundary? Yes, position to right of pin and center vertically
  */

  xPos = xClick - cardWidthMiddle + containerOffsetLeft;

  if ((xClick + cardWidthMiddle + boundaries.right) > xPage) {
    //exceeds right boundary or the page right boundary
    xPos = xClick - offset - cardWidth;
    yPos = yClick - cardHeightMiddle;

    if (xClick - cardWidth < 0 || xPos < 0) {
      //--- shoudl figure out how much from the center point to 0 would be the best left border
      xPos = xPage - cardWidth - offset; // position the card close to the left rail but with a padding of the difference
      yPos = null;
    }

  } else if ((xClick - cardWidthMiddle) < 0) {
    //exceeds left boundary
    xPos = xClick + offset;
    yPos = yClick - cardHeightMiddle;

    if (xClick + cardWidthMiddle > xPage) {
      //--- still exceeds right boundary
      xPos = (xPage - cardWidth) - ((xPage - xClick) / 4); //we have figured out the right border, now need diff
      yPos = null;
    } else if (xClick - cardWidthMiddle < 0 && yClick - cardHeightMiddle < 0) {
      xPos = xClick / 4;
    } else if (xClick - cardWidthMiddle < 0) {
      xPos = xClick / 4;
      yPos = null;
    }
  }

  if (!yPos) {
    // position card above the pin
    yPos = yClick + containerOffsetTop - (markerHeight + cardHeight) - tailSize;
    // set the tip above the pin (below the card)
    $element.addClass('bottom-tail');
  }

  if (yPos < 0) {
    // the top would exceed the top of the page
    yPos = yClick + containerOffsetTop + tailSize;
    // set the tip below the pin (above the card)
    $element.addClass('top-tail');
  } else if ((xPos + cardWidth + boundaries.right) > xPage) {
    // would exceed right boundary because of left boundary off center adjustment. Position below
    yPos = yClick + offset;
  } else if (yPos + cardHeightMiddle > yPage - cardHeightMiddle - boundaries.bottom) {
    // the bottom would of the card exceed the page bottom or the page bottom boundary
    yPos = yClick - offset - cardHeight;
  }

  //--- should have final step here to see if yPos + cardHeight would exceed, then run through left and right routine and middle align?

  if (yPos + cardHeight > yPage) {

    yPos = yClick - cardHeightMiddle;

    if ((xClick + cardWidth + boundaries.right) > xPage) {
      //--- go left
      xPos = xClick - offset - cardWidth;
    } else {
      //-- go right
      xPos = xClick + offset;
    }
  }

  $element.css({
    left: xPos,
    top: yPos
  });
};

