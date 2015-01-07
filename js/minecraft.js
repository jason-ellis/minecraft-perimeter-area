jQuery(document).ready(function() {

    // Set global variables
    var $squares;
    var $canvas = jQuery("#mc-canvas");
    var canvasSize = 25; // number of squares on each side
    var rectangle; // contains rectangle attributes
    var winCount = 0;

    /* Functions */

    // Create new canvas
    function newCanvas() {
        // Reset items from previous game
        jQuery('#mc-alert-sign').css('display', 'none');
        $canvas.html("");
        jQuery(".mc-input").val("");
        jQuery(".mc-response").empty();

        console.log("winCount: " + winCount);

        // calculate rectangle and create variable out of returned data
        rectangle = calcRectangle();

        // Array of div elements that will be div squares
        var canvasDivs = [];

        for(var i = 0; i < canvasSize; i++) {
            for(var j = 0; j < canvasSize; j++) {
                var newDiv = "<div class='mc-square'></div>";
                newDiv = jQuery(newDiv).data('row', i+1).data('col', j+1);
                jQuery(newDiv).addClass('mc-' + surfaceType(rectangle, jQuery(newDiv).data('row'), jQuery(newDiv).data('col')));
                canvasDivs.push(newDiv);
            }
        }

        for(var i = 0; i < canvasDivs.length; i++) {
            jQuery($canvas).append(canvasDivs[i]);
        }

        resizeCanvas();
        displayInfo();
    }; // end newCanvas

    function resizeCanvas() {
        // Set canvas width to integer
        var canvasWidth = Math.round(jQuery("#mc-canvas").width());
        jQuery($canvas).css("width", canvasWidth);
        jQuery($canvas).css("padding-bottom", canvasWidth);

        // Because we're working with squares, we're using the W for both H and W
        $squares = jQuery("div .mc-square");
        var squareW = (canvasWidth / canvasSize) + "px";
        jQuery($squares).css("height", squareW);
        jQuery($squares).css("width", squareW);
    }; // end resizeCanvas

    function calcRectangle() {
        // Calc rect size min = 2 max = canvas size
        var rectL = Math.floor(Math.random() * ((canvasSize + 1) - 2) + 2);
        var rectW = Math.floor(Math.random() * ((canvasSize + 1) - 2) + 2);

        // view rect size in console and test for out of bounds
        if(rectL > canvasSize || rectW > canvasSize
            || rectL < 2 || rectW < 2) {
            alert("Rectangle size is out of bounds in calcRectangle!");
        }

        // Calculate rectangle padding on canvas
        var padW = (canvasSize - rectW) / 2;
        var padH = (canvasSize - rectL) / 2;

        // return object with rect dimensions and padding
        return {"padX": padW,
                "padY": padH,
                "width": rectW,
                "length": rectL
        };
    }; // end calcRectangle

    function surfaceType(rectangle, divRow, divCol) {
        var rectMinX = rectangle['padX'];
        var rectMaxX = rectMinX + rectangle['width'];
        var rectMinY = rectangle['padY'];
        var rectMaxY = rectMinY + rectangle['length'];

        if ((divCol > rectMinX && divCol <= rectMaxX) &&
            (divRow > rectMinY && divRow <= rectMaxY)) {
            return 'dirt';
        }
        else return 'grass';
    }

    function displayInfo() {
        $canvas.append("<div class='mc-sign' id='mc-length-sign'>Length:<br>" +
        rectangle['length'] + "</div>" +
        "<div class='mc-sign' id='mc-width-sign'>Width:<br>" +
        rectangle['width'] + "</div>");
    }; // end displayInfo

    function checkAnswers() {
        var area = false;
        var perimeter = false;

        var correctA = (rectangle['length'] * rectangle['width']);
        var correctP = ((rectangle['length'] * 2) + (rectangle['width'] * 2));

        // Check area answer
        jQuery('#mc-area-response').html("");
        if(isNaN(jQuery('#mc-area-input').val()) || jQuery('#mc-area-input').val() == '') {
            jQuery('#mc-area-response').append("<span class='mc-info-neg'>Please enter a number as your answer.</span>");
        }
        else if(jQuery('#mc-area-input').val() == correctA) {
            jQuery('#mc-area-response').append("<span class='mc-info-pos'>That is correct!</span>");
            area = true;
        }
        else {
            jQuery('#mc-area-response').append("<span class='mc-info-neg'>That is incorrect. Calculate " +
            "area using the formula L x W = A</span>");
        }

        // Check perimeter answer
        jQuery('#mc-perimeter-response').html("");
        if(isNaN(jQuery('#mc-perimeter-input').val()) || jQuery('#mc-perimeter-input').val() == '') {
            jQuery('#mc-perimeter-response').append("<span class='mc-info-neg'>Please enter a number as your answer.</span>");
        }
        else if(jQuery('#mc-perimeter-input').val() == correctP) {
            jQuery('#mc-perimeter-response').append("<span class='mc-info-pos'>That is correct!</span>");
            perimeter = true;
        }
        else {
            jQuery('#mc-perimeter-response').append("<span class='mc-info-neg'>That is incorrect. Calculate " +
            "perimeter using the formula 2L + 2W = P</span>");
        }

        // If both answers are correct
        if(area && perimeter) {
            correctAnswer(correctP, correctA);
        }
    }

    function correctAnswer(perimeter, area) {
        var $perimeterFormula = jQuery('#mc-perimeter-formula');
        var $areaFormula = jQuery('#mc-area-formula');

        jQuery(".mc-response").empty();

        $perimeterFormula.html('')
            .append('(2 x ' + rectangle['length'] + ') + (2 x ' + rectangle['width'] + ') = ' + perimeter);
        $areaFormula.html('').append(rectangle['length'] + ' x ' + rectangle['width'] + ' = ' + area);

        jQuery('#mc-alert-sign').css('display', 'block');
        winCount++;
    }

    newCanvas();

    /* Events */

    jQuery("#mc-submit:button").click(function() {
            checkAnswers();
    }); // end check area answer

    jQuery("#mc-continue").click(function() {
        newCanvas();
        return false;
    });

}); // end ready