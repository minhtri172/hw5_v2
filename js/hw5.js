/*
    File: hw5.js
    GUI Assigment: Implementing a Bit of Scrabble with Drag-and-Drop  - PART: Extra Credits
    Minh Le, Umass Lowell Computer Science, minhtri_le@student.uml.edu
    Copyright (C) 2021 by Minh Le. 
    Updated by ML on December 4, 2021 at 11:00pm
*/

$(document).ready(function () {
  // GLOBAL VARIABLES HERE
  // Tiles ditribution
  var ScrabbleTiles = [];
  ScrabbleTiles["A"] = { "value": 1, "distribution": 9, "remaining": 9 };
  ScrabbleTiles["B"] = { "value": 3, "distribution": 2, "remaining": 2 };
  ScrabbleTiles["C"] = { "value": 3, "distribution": 2, "remaining": 2 };
  ScrabbleTiles["D"] = { "value": 2, "distribution": 4, "remaining": 4 };
  ScrabbleTiles["E"] = { "value": 1, "distribution": 12, "remaining": 12 };
  ScrabbleTiles["F"] = { "value": 4, "distribution": 2, "remaining": 2 };
  ScrabbleTiles["G"] = { "value": 2, "distribution": 3, "remaining": 3 };
  ScrabbleTiles["H"] = { "value": 4, "distribution": 2, "remaining": 2 };
  ScrabbleTiles["I"] = { "value": 1, "distribution": 9, "remaining": 9 };
  ScrabbleTiles["J"] = { "value": 8, "distribution": 1, "remaining": 1 };
  ScrabbleTiles["K"] = { "value": 5, "distribution": 1, "remaining": 1 };
  ScrabbleTiles["L"] = { "value": 1, "distribution": 4, "remaining": 4 };
  ScrabbleTiles["M"] = { "value": 3, "distribution": 2, "remaining": 2 };
  ScrabbleTiles["N"] = { "value": 1, "distribution": 6, "remaining": 6 };
  ScrabbleTiles["O"] = { "value": 1, "distribution": 8, "remaining": 8 };
  ScrabbleTiles["P"] = { "value": 3, "distribution": 2, "remaining": 2 };
  ScrabbleTiles["Q"] = { "value": 10, "distribution": 1, "remaining": 1 };
  ScrabbleTiles["R"] = { "value": 1, "distribution": 6, "remaining": 6 };
  ScrabbleTiles["S"] = { "value": 1, "distribution": 4, "remaining": 4 };
  ScrabbleTiles["T"] = { "value": 1, "distribution": 6, "remaining": 6 };
  ScrabbleTiles["U"] = { "value": 1, "distribution": 4, "remaining": 4 };
  ScrabbleTiles["V"] = { "value": 4, "distribution": 2, "remaining": 2 };
  ScrabbleTiles["W"] = { "value": 4, "distribution": 2, "remaining": 2 };
  ScrabbleTiles["X"] = { "value": 8, "distribution": 1, "remaining": 1 };
  ScrabbleTiles["Y"] = { "value": 4, "distribution": 2, "remaining": 2 };
  ScrabbleTiles["Z"] = { "value": 10, "distribution": 1, "remaining": 1 };
  ScrabbleTiles["_"] = { "value": 0, "distribution": 2, "remaining": 2 };

  /*
  ###############################################################
  #   This variable stores 100 letter
  #   It generate random tiles with given distribution
  #   For example, A with 9 that means 9 As in sampleSpaceLetter 
  #   There are 9 change of 100 to pick A
  #   sampleSpaceLetter contains:
  #   ['A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'B', 'B', 'C', 'C', 'D', 'D', 'D', 'D', 
  #   'E', 'E', 'E', 'E', 'E', 'E', 'E', 'E', 'E', 'E', 'E', 'E', 'F', 'F', 'G', 'G', 'G', 
  #   'H', 'H', 'I', 'I', 'I', 'I', 'I', 'I', 'I', 'I', 'I', 'J', 'K', 'L', 'L', 'L', 'L', 'M', 
  #   'M', 'N', 'N', 'N', 'N', 'N', 'N', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'P', 'P', 'Q', 
  #   'R', 'R', 'R', 'R', 'R', 'R', 'S', 'S', 'S', 'S', 'T', 'T', 'T', 'T', 'T', 'T', 'U', 'U', 
  #   'U', 'U', 'V', 'V', 'W', 'W', 'X', 'Y', 'Y', 'Z', '_', '_']
  #   Random() is uniform (equal probability)  
  ###############################################################
  */
  sampleSpaceLetters = [];

  // Create sample space for letters depend on their distribution
  var i, j;
  var distribution;
  for (i = 0; i < Object.keys(ScrabbleTiles).length; i++) {
    distribution = ScrabbleTiles[Object.keys(ScrabbleTiles)[i]].distribution;
    for (j = 0; j < distribution; j++) {
      sampleSpaceLetters.push(Object.keys(ScrabbleTiles)[i]);
    }
  }

  /*
  ################################################################
  #   MEMORY
  #   Store the result words (this variable is very important!)
  #   It will save the tiles on the board
  #   It stores exactly what are on the board as user's screen
  #   myString contains 17x17 "*" at initialization
  #   It should be 15x15, but there is a bug
  #   I check if there are letters in myString, it will go out of index
  #   and get error "bound of index", so I changed to 17x17
  #   The square outside helps to fix error "bound of index"
  ################################################################
  */
  var myString = [];
  for (i = 0; i < 17; i++) {
    myString[i] = new Array(17).fill("*");
  }

  //console.log(myString)

  var dict = {}; // The dictionary lookup object
  var chosenLetter, chosenDirection; // chosen letter and chosen direction (from dialog messages)
  var coef = 100; // coefficient used for random
  var totalScore = 0; // it stores total score
  var isValidWord = false; // it determine the word is valid or not
  var direction = 0; // 0: no direction, 1: left-right, 2: up-down
  var leftRight = 1; // 1 means go left-right
  var upDown = 2; // 2 means go up-down
  var changeDirection = true; // it determines chosen direction
  var startGame = false; // used to determine the game starts or not
  var acceptTile = false; // used to determine the tile is accepted or not
  var saveRow = -1; // used to block other directions, only allow left-right
  var saveCol = -1; // used to block other directions, only allow up-down
  var firstTile = false; // used to determine the first tile is placed on the board

  // Set dictionary to dict (data get from the file dict.txt)
  // Reference from : https://johnresig.com/blog/dictionary-lookups-in-javascript/
  $.get("dict/dict.txt", function (file) {
    // Get words
    var words = file.split("\n");
    //console.log(words);

    // Create an boolean array to store words
    // Set all words to true, then use it to check whether the word in dictionary 
    for (i = 0; i < words.length; i++) {
      dict[words[i]] = true;
    }

    //console.log(dict);
  });

  /*
  #########################################################################
  #   Create the board
  #   It determine where the tile is
  #   It is used for making tiles on the board (a picture)
  #   The board has 15x15
  #   data-price: determine the bonus score x2 or x3
  #   word: if a word is valid, x2 or x3
  #   letter: if a letter is on this square, x2 or x3
  #   data-index: save the index (row and col) of the square on the board
  ########################################################################
  */
  $("#board").append("<table id='tableBoard'></table>");

  for (i = 1; i <= 15; i++) {
    $("#tableBoard").append("<tr></tr>");
    for (j = 1; j <= 15; j++) {
      // row 1 and row 15
      if (i == 1 || i == 15) {
        if (j == 1 || j == 8 || j == 15) {
          $("#board tr").eq(i - 1).append("<td data-index='" + i + "-" + j + "' data-price='word-3' data-status='off'></td>");
        } else if (j == 4 || j == 12) {
          $("#board tr").eq(i - 1).append("<td data-index='" + i + "-" + j + "' data-price='letter-2' data-status='off'></td>");
        } else {
          $("#board tr").eq(i - 1).append("<td data-index='" + i + "-" + j + "' data-status='off'></td>");
        }
      }
      // row 2 and row 14
      if (i == 2 || i == 14) {
        if (j == 2 || j == 14) {
          $("#board tr").eq(i - 1).append("<td data-index='" + i + "-" + j + "' data-price='word-2' data-status='off'></td>");
        } else if (j == 6 || j == 10) {
          $("#board tr").eq(i - 1).append("<td data-index='" + i + "-" + j + "' data-price='letter-3' data-status='off'></td>");
        } else {
          $("#board tr").eq(i - 1).append("<td data-index='" + i + "-" + j + "' data-status='off'></td>");
        }
      }
      // row 3 and row 13
      if (i == 3 || i == 13) {
        if (j == 3 || j == 13) {
          $("#board tr").eq(i - 1).append("<td data-index='" + i + "-" + j + "' data-price='word-2' data-status='off'></td>");
        } else if (j == 7 || j == 9) {
          $("#board tr").eq(i - 1).append("<td data-index='" + i + "-" + j + "' data-price='letter-2' data-status='off'></td>");
        } else {
          $("#board tr").eq(i - 1).append("<td data-index='" + i + "-" + j + "' data-status='off'></td>");
        }
      }
      // row 4 and row 12
      if (i == 4 || i == 12) {
        if (j == 1 || j == 8 || j == 15) {
          $("#board tr").eq(i - 1).append("<td data-index='" + i + "-" + j + "' data-price='letter-2' data-status='off'></td>");
        } else if (j == 4 || j == 12) {
          $("#board tr").eq(i - 1).append("<td data-index='" + i + "-" + j + "' data-price='word-2' data-status='off'></td>");
        } else {
          $("#board tr").eq(i - 1).append("<td data-index='" + i + "-" + j + "' data-status='off'></td>");
        }
      }
      // row 5 and row 11
      if (i == 5 || i == 11) {
        if (j == 5 || j == 11) {
          $("#board tr").eq(i - 1).append("<td data-index='" + i + "-" + j + "' data-price='word-2' data-status='off'></td>");
        } else {
          $("#board tr").eq(i - 1).append("<td data-index='" + i + "-" + j + "' data-status='off'></td>");
        }
      }
      // row 6 and row 10
      if (i == 6 || i == 10) {
        if (j == 2 || j == 6 || j == 10 || j == 14) {
          $("#board tr").eq(i - 1).append("<td data-index='" + i + "-" + j + "' data-price='letter-3' data-status='off'></td>");
        } else {
          $("#board tr").eq(i - 1).append("<td data-index='" + i + "-" + j + "' data-status='off'></td>");
        }
      }
      // row 7 and row 9
      if (i == 7 || i == 9) {
        if (j == 3 || j == 7 || j == 9 || j == 13) {
          $("#board tr").eq(i - 1).append("<td data-index='" + i + "-" + j + "' data-price='letter-2' data-status='off'></td>");
        } else {
          $("#board tr").eq(i - 1).append("<td data-index='" + i + "-" + j + "' data-status='off'></td>");
        }
      }
      // row 8 (center)
      if (i == 8) {
        if (j == 1 || j == 15) {
          $("#board tr").eq(i - 1).append("<td data-index='" + i + "-" + j + "' data-price='word-3' data-status='off'></td>");
        } else if (j == 4 || j == 12) {
          $("#board tr").eq(i - 1).append("<td data-index='" + i + "-" + j + "' data-price='letter-2' data-status='off'></td>");
        } else if (j == 8) {
          $("#board tr").eq(i - 1).append("<td data-index='" + i + "-" + j + "' data-status='off'></td>");
        } else {
          $("#board tr").eq(i - 1).append("<td data-index='" + i + "-" + j + "' data-status='off'></td>");
        }
      }
    }
  }

  /*
  #####################################################################################
  #   Create the holder (rack)
  #   There is 7 tiles on the holder
  #   data-status of img: if the tile is on the board, it turn on; otherwise, turn off
  #   data-status of td: if the tile is on the holder, it turn on; otherwise, turn off
  #   data-index-holder: determine where the tile belong to which rack (0 to 7)
  #   data-name: the name of the letter ("A-Z" and "_")
  #   accept: allow only one tile on the same square (td)
  #   coef: range that the tiles can be chosen. e.g: 10 means [0, 9], 100 means [0 - 99], etc
  ######################################################################################
  */
  $("#holder").append("<table id='tableHolder'></table>");

  $("#tableHolder").append("<tr></tr>");
  // Create 7 tiles on the rack
  for (i = 0; i < 7; i++) {
    var randomLetter = Math.floor(Math.random() * coef); // choose from index 0 to 99
    var nameLetter = sampleSpaceLetters[randomLetter];
    if (nameLetter != null) {
      ScrabbleTiles[nameLetter].remaining--;
      coef--;
      // Remove the selected tiles from the sample space
      var index = sampleSpaceLetters.indexOf(nameLetter);
      sampleSpaceLetters.splice(index, 1);
    }
    //console.log(sampleSpaceLetters)

    // Check if the tile is blank or not
    if (nameLetter != "_") {
      $("#tableHolder tr").append(
        "<td data-status='on' data-index='" + i + "'><img data-name='" + nameLetter +
        "' src='./images/Scrabble_Tile_" + nameLetter + ".jpg'" + "data-index-holder=" + i + "></td>");
      $("#tableHolder td").eq(i).droppable({
        accept: "img[data-index-holder='" + i + "']"
      });
    } else {
      nameLetter = "Blank";
      $("#tableHolder tr").append(
        "<td data-status='on' data-index='" + i + "'><img data-name='" + nameLetter
        + "' src='./images/Scrabble_Tile_" + nameLetter + ".jpg'" + "data-index-holder=" + i + "></td>");
      $("#tableHolder td").eq(i).droppable({
        accept: "img[data-index-holder='" + i + "']"
      });
    }
  }

  /*
  ########################################################################
  #   Button: start over the game
  #   Call the dialog to confirm
  ########################################################################
  */
  $("#btnStartOver").click(function () {
    $("#dialog-confirm").dialog("open");
  });

  /*
  ########################################################################
  #   Button reset: call back the tiles back to the rack   
  ########################################################################
  */
  $("#btnReset").click(function () {
    // status = 'off' that means the tile is on the board
    if ($("#tableHolder td[data-status='off']").length > 0) { // if tiles on the board
      // after the tiles go back the rack, status of td contains the tails is back to "on" 
      $("#tableHolder td[data-status='off']").attr("data-status", "on");

      // Call back tiles to the rack
      $("img[data-status='on']").css({
        position: "relative",
        top: 0,
        left: 0
      });

      // clear error messages
      printErrorMessages("");

      // Reset the board to accept tiles again
      $("#tableBoard td").droppable('option', 'accept', "img");

      // Clear display word and score
      $("#myString").text("Word: ");
      $("#score").text("Score: 0");

      // Set status of td on the board to off when tiles leave it and come back to the rack
      for (i = 0; i < $("img[data-status='on']").length; i++) {
        var index = $("img[data-status='on']").eq(i).attr("data-index");
        index = index.split("-");
        var row = index[0];
        var col = index[1];

        //console.log($("img[data-status='on']").eq(i).attr("data-index"))
        $("#tableBoard td[data-index='" + row + "-" + col + "']").attr("data-status", "off");
        $("#tableBoard td[data-index='" + row + "-" + col + "']").removeAttr("data-name");
        myString[row][col] = "*"; // after it come back to the rack, clear it on the memory (myString)
      }

      // remove attribute on the tiles
      $("img").removeAttr("data-status");
      $("img").removeAttr("data-index");

      // This determines the tile is space or not
      // if it is space, turn it back to space image when it is on the rack
      $("#tableHolder img[data-previous-letter='_']").attr("src", "./images/Scrabble_Tile_Blank.jpg");
      $("#tableHolder img[data-previous-letter='_']").attr("data-name", "Blank");

      // Reset conditional variable (directions)
      resetVariables();
    } else { // no tiles on the board
      printErrorMessages("No tiles on the board.");
    }
  });

  /*
  ########################################################################
  #   Button save: save the word on the board and score
  ########################################################################
  */
  $("#btnSave").click(function () {
    // Get index of the tile
    var index = $("img[data-status='on']").attr("data-index");
    var row, col;
    if (index != null) {
      index = index.split("-");
      row = index[0];
      col = index[1];
    }

    //console.log("line 302: " + row + ": " + col);

    // Get score
    var containScore = $("#score").text();
    containScore = containScore.split(" ");
    var score = parseInt(containScore[1]);

    // Get the word
    var containString = $("#myString").text();
    containString = containString.split(" ");
    var stringRes = containString[1];

    // increase total score
    totalScore += score;

    // If there is no active tiles on the board, cannot save the word and display error message
    // if all td on the holder is off that means no tiles on the board 
    if ($("#tableHolder td[data-status='off']").length > 0) {
      if (isValidWord) { // if the word is valid
        printErrorMessages("");

        // Set position of the tiles (images)
        $("img[data-status='on']").css({
          position: "relative",
          top: 0,
          left: -2
        });

        // Display words, scores and saved words
        $("#myString").text("Word: ");
        $("#score").text("Score: 0");
        $("#totalScore").text("Total Score: " + totalScore);
        $("#save").append("<p>Word: " + stringRes + " ---- Score: " + score + "</p>");

        isValidWord = false; // prepare for new words


        //console.log($("#tableBoard td[data-status='on']"));
        var index, row, col; // these variables are different from outside, used to save images to the board

        // SAVE IMAGES TO BOARD
        for (i = 0; i < $("img[data-status='on']").length; i++) {
          //console.log($("img[data-status='on']").eq(i).attr("data-name"));
          index = $("img[data-status='on']").eq(i).attr("data-index");
          index = index.split("-");
          //console.log("line 326: " + index);
          row = parseInt(index[0]);
          col = parseInt(index[1]);

          $("#tableBoard td[data-index='" + row + "-" + col + "']").attr("data-save", "on");
          $("#tableBoard td[data-index='" + row + "-" + col + "']").droppable("disable");
          $("#tableBoard td[data-index='" + row + "-" + col + "']").append(
            "<img src='./images/Scrabble_Tile_" + $("img[data-status='on']").eq(i).attr("data-name") + ".jpg'>"
          )
        }

        // set the image back to before on the board
        $("img").removeAttr("data-index");
        $("img[data-status='on']").removeAttr("data-previous-letter");
        $("#tableBoard td").droppable('option', 'accept', "img");

        // Create new tiles on the rack
        // only tiles on the board, and keep the tiles that still are on the rack
        // #tableHolder td: hold the tile (status: on means has a tile, off means the tile on the board)
        for (i = 0; i < 7; i++) {
          if ($("#tableHolder td").eq(i).attr("data-status") == "off") { // only tiles on the board
            //console.log($("#tableHolder td").eq(i).attr("data-status"))
            var randomLetter = Math.floor(Math.random() * coef);
            var nameLetter = sampleSpaceLetters[randomLetter];
            if (nameLetter != null) { // == null means no tiles available
              ScrabbleTiles[nameLetter].remaining--;
              coef--;
              var index = sampleSpaceLetters.indexOf(nameLetter);

              // remove letter from sample space
              if (sampleSpaceLetters.length > 0) {
                sampleSpaceLetters.splice(index, 1);
                updateRemainTable();
              }

              // Check if the tile is space
              if (nameLetter != "_") {
                $("#tableHolder img").eq(i).attr("data-name", nameLetter);
                $("#tableHolder img").eq(i).attr("src", "./images/Scrabble_Tile_" + nameLetter + ".jpg");
                $("#tableHolder img").eq(i).removeAttr("data-status");
                $("#tableHolder img").eq(i).removeAttr("data-index");
              } else {
                nameLetter = "Blank";
                $("#tableHolder img").eq(i).attr("data-name", nameLetter);
                $("#tableHolder img").eq(i).attr("src", "./images/Scrabble_Tile_" + nameLetter + ".jpg");
                $("#tableHolder img").eq(i).removeAttr("data-status");
                $("#tableHolder img").eq(i).removeAttr("data-index");
              }
            } else {
              printErrorMessages("There is no more letter.");
            }
            $("#tableHolder td").eq(i).attr("data-status", "on");
          }
        }

        // reset global variables
        isValidWord = false;
        saveCol = -1;
        saveRow = -1;
        acceptTile = false;
        changeDirection = true;
        firstTile = false;
        direction = 0;
      } else {
        printErrorMessages("Word is not valid.");
      }
    } else {
      printErrorMessages("No words on the board.");
    }
  });

  /*
  ####################################################
  #   Button get new 7 tiles
  ####################################################
  */
  $("#btnNew7Tiles").click(function () {
    // status = 'off' that means the tile is on the board
    // status = 'on' that means the tile is on the rack

    // clear error messages
    printErrorMessages("");

    // Create new tiles on the rack
    for (i = 0; i < 7; i++) {
      if ($("#tableHolder td").eq(i).attr("data-status") == "on") {
        var randomLetter = Math.floor(Math.random() * coef);
        var nameLetter = sampleSpaceLetters[randomLetter];
        //console.log(nameLetter);

        if (nameLetter != null) {
          if ($("#tableHolder img").eq(i).attr("data-name") != "Blank") {
            ScrabbleTiles[nameLetter].remaining--;
            ScrabbleTiles[$("#tableHolder img").eq(i).attr("data-name")].remaining++;
            var index = sampleSpaceLetters.indexOf(nameLetter);

            // remove letter from sample space
            if (sampleSpaceLetters.length > 0) {
              sampleSpaceLetters.splice(index, 1);
              sampleSpaceLetters.splice(index, 0, $("#tableHolder img").eq(i).attr("data-name"));
              updateRemainTable();
            }

            var indexDraggable = $("#tableHolder img").eq(i).attr("data-index-holder");

            if (nameLetter != "_") {
              $("#tableHolder img[data-index-holder='" + indexDraggable + "']").attr("data-name", nameLetter);
              $("#tableHolder img[data-index-holder='" + indexDraggable + "']").attr("src", "./images/Scrabble_Tile_" + nameLetter + ".jpg");
              $("#tableHolder img[data-index-holder='" + indexDraggable + "']").removeAttr("data-status");
              $("#tableHolder img[data-index-holder='" + indexDraggable + "']").removeAttr("data-index");
            } else {
              nameLetter = "Blank";
              $("#tableHolder img[data-index-holder='" + indexDraggable + "']").attr("data-name", nameLetter);
              $("#tableHolder img[data-index-holder='" + indexDraggable + "']").attr("src", "./images/Scrabble_Tile_" + nameLetter + ".jpg");
              $("#tableHolder img[data-index-holder='" + indexDraggable + "']").removeAttr("data-status");
              $("#tableHolder img[data-index-holder='" + indexDraggable + "']").removeAttr("data-index");
            }
          }
        } else {
          printErrorMessages("There is no more letter.");
        }
        $("#tableHolder td").eq(i).attr("data-status", "on");
      }
    }
    // Reset conditional variable (directions)
    resetVariables();
  });

  // display rules
  $("#btnRule").click(function () {
    $("#dialog-rules").dialog("open");
  });

  // Create remaining table
  $("#display").append("<table id='tableRemain'></table>");
  j = 0;
  $("#tableRemain").append("<tr><th colspan='9'>Letters Remaining</th></tr>");
  for (i = 1; i <= 3; i++) {
    $("#tableRemain").append("<tr></tr>");
    while (j < 9 * i) {
      if (Object.keys(ScrabbleTiles)[j] != null) {
        $("#tableRemain tr").eq(i).append("<td>" +
          Object.keys(ScrabbleTiles)[j] + ": " +
          ScrabbleTiles[Object.keys(ScrabbleTiles)[j]].remaining + "</td>");
      }
      j++;
    }
  }

  // Create choose table letter when play has blank
  $("#dialog-blank").append("<ul id='selectables'></ul>");
  for (i = 0; i < Object.keys(ScrabbleTiles).length - 1; i++) {
    $("#dialog-blank ul").append("<li data-name='" +
      Object.keys(ScrabbleTiles)[i] + "'><img src='./images/Scrabble_Tile_" +
      Object.keys(ScrabbleTiles)[i] + ".jpg'></li>");
  }

  // Control how to choose a word, blank tile means players can choose any tile
  $("#dialog-blank").dialog({
    dialogClass: "no-close", // no closed tag
    autoOpen: false, // no auto open
    modal: true, // can drag move around
    width: "500",
    draggable: false,
    buttons: {
      Ok: function () {
        if (chosenLetter != null) {
          // A letter is chosen
          //console.log(chosenLetter)
          var index = $("img[data-status='on'][data-name='Blank']").attr("data-index");
          $("img[data-status='on'][data-name='Blank']").attr("data-name", chosenLetter);

          // Set the chosen letter to memory (myString)

          if (index != null) {
            var tempIndex = index.split("-");
            var row = parseInt(tempIndex[0]);
            var col = parseInt(tempIndex[1]);
            myString[row][col] = chosenLetter;
          }

          $("#tableBoard td[data-index='" + index + "']").attr("data-name", chosenLetter);

          //console.log("update string: " + myString);

          // determine if players go left-right or up-down
          if (changeDirection && !acceptTile) {
            for (i = 1; i < 15; i++) {
              if ($("#tableBoard td[data-index='" + row + "-" + (col + i) + "']").attr("data-status") == "on") {
                direction = leftRight;
                saveRow = row;
                break;
              }
              if ($("#tableBoard td[data-index='" + row + "-" + (col - i) + "']").attr("data-status") == "on") {
                direction = leftRight;
                saveRow = row;
                break;
              }

              if ($("#tableBoard td[data-index='" + (row + i) + "-" + col + "']").attr("data-status") == "on") {
                direction = upDown;
                saveCol = col;
                break;
              }

              if ($("#tableBoard td[data-index='" + (row - i) + "-" + col + "']").attr("data-status") == "on") {
                direction = upDown;
                saveCol = col;
                break;
              }
            }
          }
          //console.log("direction line 440:" + direction);
          //console.log(direction)
          //console.log(acceptTile)
          // Display word and score
          if (direction != 0 && acceptTile || $("#tableHolder td[data-status='off']").length == 1) {
            var my_word = displayString(row, col)
            $("#myString").text("Word: " + my_word);
            $("#score").text("Score: " + score(row, col, my_word));
          }

          chosenLetter = null; // set chosen letter to null means no letter is chosen

          $("li[class='ui-selectee ui-selected']").css("background-color", "black");
          $(this).dialog("close"); // close dialog
        } else {
          if ($("#dialog-blank p").length) {
            $("#dialog-blank p").remove();
          }
          $("#dialog-blank").append("<p>Please choose one letter.</p>")
          $("#dialog-blank p").css("color", "red");
        }

      }
    }
  });

  // Selectable for dialog-blank
  $("#selectables").selectable({
    selected: function (event, ui) { // selected
      chosenLetter = $(ui.selected).attr("data-name");
      //console.log(chosenLetter)
      if (chosenLetter != null) {
        // Set the chosen letter
        // data-previous-letter: used for change the tiles back to space if it comes back to the rack
        if ($("#dialog-blank p").length) {
          $("#dialog-blank p").remove();
        }
        $("img[data-status='on'][data-name='Blank']").attr("data-previous-letter", "_");
        $("img[data-status='on'][data-name='Blank']").attr("src", "./images/Scrabble_Tile_" + chosenLetter + ".jpg")
        $(ui.selected).css("background-color", "red");
      } else {
        $("img[data-status='on'][data-name='Blank']").attr("src", "./images/Scrabble_Tile_Blank.jpg")
        $("li[class='ui-selectee ui-selected']").css("background-color", "black");
      }
    },
    unselected: function (event, ui) { // unselected
      $(ui.unselected).css("background-color", "black");
      chosenLetter = null;
    }
  });

  // Dialog choose direction
  $("#dialog-direction").dialog({
    dialogClass: "no-close",
    draggable: false,
    autoOpen: false,
    modal: true,
    draggable: false,
    width: "500",
    buttons: {
      Ok: function () {
        if (chosenDirection != null) {

          // If choose left-right, delete the saveCol (unblock only allow move left-right)
          if (chosenDirection == "leftRight") {
            saveCol = -1;
          }
          // If choose up-down, delete the saveRow (unblock only allow move up-down)
          if (chosenDirection == "upDown") {
            saveRow = -1;
          }
          $("#select-direction li").css("background-color", "black");
          $(this).dialog("close");
        } else {
          if ($("#dialog-direction p").length) {
            $("#dialog-direction p").remove();
          }
          $("#dialog-direction").append("<p>Please choose one letter.</p>")
          $("#dialog-direction p").css("color", "red");
        }
      }
    }
  });

  // Selectable for dialog-direction
  $("#select-direction").selectable({
    selected: function (event, ui) {
      chosenDirection = $(ui.selected).attr("data-name");
      //console.log(chosenDirection)
      if (chosenDirection != null) {
        if ($("#dialog-direction p").length) {
          $("#dialog-direction p").remove();
        }

        if (chosenDirection == "leftRight") {
          direction = leftRight;
        }

        if (chosenDirection == "upDown") {
          direction = upDown;
        }

        // Dislay word and score, when players choose letters
        var index = $("img[data-status='on']").attr("data-index");
        if (index != null) {
          index = index.split("-");
          var row = index[0];
          var col = index[1];
          row = parseInt(row);
          col = parseInt(col);
          var my_word = displayString(row, col)
          $("#myString").text("Word: " + my_word);
          $("#score").text("Score: " + score(row, col, my_word));
        }
        $("#select-direction li[class='ui-selectee ui-selected']").css("background-color", "red");
      } else {
        $("#select-direction li[class='ui-selectee ui-selected']").css("background-color", "black");
      }
    },
    unselected: function (event, ui) {
      $(ui.unselected).css("background-color", "");
    }
  });

  // Dialog display rules for the game
  $("#dialog-rules").dialog({
    autoOpen: false,
    width: "500",
    height: "400",
    modal: true,
    draggable: false,
    buttons: {
      Ok: function () {
        $(this).dialog("close");
      }
    }
  });

  // Confirm to messure players want to start the game again
  $("#dialog-confirm").dialog({
    autoOpen: false,
    height: "auto",
    width: "400",
    modal: true,
    draggable: false,
    buttons: {
      Ok: function () {
        // Set global variable back to starting state
        startGame = false;
        acceptTile = false;
        saveRow = -1;
        saveCol = -1;
        firstTile = false;
        changeDirection = true;
        isValidWord = false;
        totalScore = 0;
        direction = 0;

        // Take back tiles to the rack
        // And change their data back to starting state
        $("img[data-status='on']").css({
          position: "relative",
          top: 0,
          left: 0
        });
        $("#tableHolder td").attr("data-status", "on");
        $("#tableBoard td").droppable("enable");
        $("#tableBoard td").droppable('option', 'accept', "img");
        $("#tableBoard td").attr("data-status", "off");
        $("#tableBoard td").removeAttr("data-name");
        $("#tableBoard td img").remove();
        $("img").removeAttr("data-index");

        // Clear memory (myString)
        for (i = 0; i < 15; i++) {
          myString[i].fill("*");
        }

        //console.log(myString)

        // Clear display
        $("#myString").text("Word: ");
        $("#score").text("Score: 0");
        $("#error-message p").text("");

        $("#totalScore").text("Total Score: 0");
        $("#save p").text("");

        //console.log("Before remove: " + sampleSpaceLetters);
        var indexOfLetter = 0;
        for (i = 0; i < Object.keys(ScrabbleTiles).length; i++) {
          distribution = ScrabbleTiles[Object.keys(ScrabbleTiles)[i]].distribution;
          ScrabbleTiles[Object.keys(ScrabbleTiles)[i]].remaining = ScrabbleTiles[Object.keys(ScrabbleTiles)[i]].distribution;
          for (j = 0; j < distribution; j++) {
            sampleSpaceLetters[indexOfLetter] = Object.keys(ScrabbleTiles)[i];
            indexOfLetter++;
          }
        }

        coef = 100; // set this value back to 100 for choose [0 to 99]

        //console.log(sampleSpaceLetters);

        // Create new tiles on the rack
        for (i = 0; i < 7; i++) {
          var randomLetter = Math.floor(Math.random() * coef);
          var nameLetter = sampleSpaceLetters[randomLetter];
          //console.log(nameLetter);

          if (nameLetter != null) {
            ScrabbleTiles[nameLetter].remaining--;
            coef--;
            var index = sampleSpaceLetters.indexOf(nameLetter);
            if (sampleSpaceLetters.length > 0) {
              sampleSpaceLetters.splice(index, 1);
            }
            updateRemainTable();
            if (nameLetter != "_") {
              $("#tableHolder img").eq(i).attr("data-name", nameLetter);
              $("#tableHolder img").eq(i).attr("src", "./images/Scrabble_Tile_" + nameLetter + ".jpg");
              $("#tableHolder img").eq(i).removeAttr("data-status");
            } else {
              nameLetter = "Blank";
              $("#tableHolder img").eq(i).attr("data-name", nameLetter);
              $("#tableHolder img").eq(i).attr("src", "./images/Scrabble_Tile_" + nameLetter + ".jpg");
              $("#tableHolder img").eq(i).removeAttr("data-status");
            }
          } else {
            printErrorMessages("There is no more letter.");
          }
        }
        //console.log("After remove: " + sampleSpaceLetters);

        $(this).dialog("close");
      },
      Cancel: function () {
        $(this).dialog("close");
      }
    }
  });

  // Draggable for the rack
  $("#tableHolder td img").draggable({
    containment: "document",
    drag: function (event, ui) {
      $(this).draggable("option", "revert", "invalid");
      $("#tableHolder td").eq($(this).attr("data-index-holder")).css("box-shadow", "0px 0px 7px 8px blue");;
    },
    stop: function (event, ui) {
      $("#tableHolder td").eq($(this).attr("data-index-holder")).css("box-shadow", "");;
    }
  });

  // Reference from: https://forum.jquery.com/topic/drag-and-drop-issue-fit-my-drop
  // Board Droppable
  $("#tableBoard td").droppable({
    drop: function (event, ui) {
      //console.log("accept items from holder");
      //console.log(myString);
      $(this).css("box-shadow", "");
      $("#tableHolder td").eq(ui.draggable.attr("data-index-holder")).attr("data-status", "off");

      var letterResult = ui.draggable.attr("data-name"); // get letter

      // Get index of the letter (where it is)
      var index = $(this).attr("data-index");
      var tempIndex = index.split("-");
      var row = parseInt(tempIndex[0]);
      var col = parseInt(tempIndex[1]);

      //console.log("row-col in the droppable board: " + row + "-" + col);
      myString[row][col] = letterResult;

      // console.log(myString);
      if (row == 8 && col == 8) {
        // START GAME HERE
        startGame = true;
        firstTile = true;
      } else {
        firstTile = false;
      }

      var isLeftRight = false; // check going left-right
      var isUpDown = false; // check going up-down
      var count = 0; // used to determine two tiles are adjacent

      // determine if play go left-right or up-down
      if (changeDirection && !acceptTile) {
        for (i = 1; i <= 15; i++) {
          count++;
          if ((col + i) <= 15) {
            if ($("#tableBoard td[data-index='" + row + "-" + (col + i) + "']").attr("data-status") == "on") {
              if (count == 1) {
                saveRow = row;
                direction = leftRight;
                isLeftRight = true;
              }
              break;
            }
          }
        }
        count = 0;
        for (i = 1; i <= 15; i++) {
          count++;
          if ((col - i) >= 1) {
            if ($("#tableBoard td[data-index='" + row + "-" + (col - i) + "']").attr("data-status") == "on") {
              if (count == 1) {
                direction = leftRight;
                saveRow = row;
                isLeftRight = true;
              }
              break;
            }
          }
        }
        count = 0;
        for (i = 1; i <= 15; i++) {
          count++;
          if ((row + i) <= 15) {
            if ($("#tableBoard td[data-index='" + (row + i) + "-" + col + "']").attr("data-status") == "on") {
              if (count == 1) {
                saveCol = col;
                direction = upDown;
                isUpDown = true;
              }
              break;
            }
          }
        }
        count = 0;
        for (i = 1; i <= 15; i++) {
          count++;
          if ((row - i) >= 0) {
            if ($("#tableBoard td[data-index='" + (row - i) + "-" + col + "']").attr("data-status") == "on") {
              if (count == 1) {
                saveCol = col;
                direction = upDown;
                isUpDown = true;
              }
              break;
            }
          }
        }
      }

      // There are two directions, so pop-up a dialog and ask players to choose the direction
      if (isLeftRight && isUpDown) {
        $("#dialog-direction").dialog("open");
      }

      //console.log("dicrection: " + direction);

      //console.log("left-right: " + goLeftRight);
      //console.log("up-down: " + goUpDown);

      //console.log("saveRow: " + saveRow);
      //console.log("saveCol: " + saveCol);


      if (!startGame) {
        // If the first tile is not at start icon, comes back to the rack
        printErrorMessages("The first tile must be at the star icon.");
        ui.draggable.draggable("option", "revert", true);
        myString[row][col] = "*";
        $("#tableHolder td[data-index='" + ui.draggable.attr("data-index-holder") + "']").attr("data-status", "on")
      } else {
        if ($(this).attr("data-index") != ui.draggable.attr("data-index")
          && $("#tableBoard td[data-status='on']").length > 0
          && ui.draggable.attr("data-index") != null) {

          // do not allow moving, when the tile is placed on the board
          printErrorMessages(
            "Once the tile is placed on the Scrabble board, it can not be moved. Take it back to the rack to move it."
          );

          // Set the tile back to the rack
          ui.draggable.draggable("option", "revert", true);

          // Delete it from the memory
          myString[row][col] = "*";

          // Set the letter name back to old value
          myString[ui.draggable.attr("data-index")] = ui.draggable.attr("data-name");
          //console.log(myString[row]);
        } else {
          if (saveRow == row || saveCol == col || firstTile) {
            if (isAdjacent(row, col)) {
              // HERE IS VALID MOVE
              if (letterResult == "Blank") {
                $("#dialog-blank").dialog("open");
              }

              if (!firstTile) {
                acceptTile = true;
                changeDirection = false;
              }

              printErrorMessages("");

              // move the tiles fit to the square on the board
              var offset = $(this).offset();
              ui.draggable.css({
                position: 'absolute',
                top: offset.top,
                left: offset.left
              });

              // Setup data for img
              ui.draggable.attr("data-index", row + "-" + col);
              ui.draggable.attr("data-status", "on");

              $(this).attr("data-status", "on");
              myString[row][col] = ui.draggable.attr("data-name");

              if (ui.draggable.attr("data-name") != "Blank") {
                //console.log("wewe")
                $(this).attr("data-name", ui.draggable.attr("data-name"));
              }

              // Display string result
              //console.log(direction)
              var my_word = displayString(row, col);
              $("#myString").text("Word: " + my_word);
              //console.log("myString: " + myString[row]);

              // Display Score
              $("#score").text("Score: " + score(row, col, my_word));

              // Does not accept two letters on the same square
              $(this).droppable('option', 'accept', ui.draggable);
            } else {
              // HERE TWO TILES ARE NOT ADJACENT
              acceptTile = false;
              ui.draggable.draggable("option", "revert", true); // Go back to the rack
              $("#tableHolder td[data-index='" + ui.draggable.attr("data-index-holder") + "']").attr("data-status", "on")
              $("#tableBoard td[data-status='off']").droppable('option', 'accept', "img");

              // Delete and set back value to myString
              myString[row][col] = "*";

              //console.log(myString);
              printErrorMessages("Do not allow space between two letters.");
              //console.log("After remove:");
              //console.log(myString);
            }
          } else {
            // HERE THE TILE IS PLACE IN THE WRONG DIRECTION
            // only allow one direction at each word
            ui.draggable.draggable("option", "revert", true);
            $("#tableHolder td[data-index='" + ui.draggable.attr("data-index-holder") + "']").attr("data-status", "on")
            myString[row][col] = "*";
            // console.log("saveRow: " + saveCol);
            // console.log("row: " + row);
            // console.log("saveCol: " + saveCol);
            // console.log("col: " + col);
            if (direction == leftRight) {
              printErrorMessages("Only allow left-right move.");
            } else if (direction == upDown) {
              printErrorMessages("Only allow up-down move.");
            } else {
              printErrorMessages("Do not allow diagonal move or a space between two letters.");
            }
          }
        }
      }
    },

    // Out of board
    out: function (event, ui) {
      //console.log("out from board");

      // re-accept all
      $(this).css("box-shadow", "");
    },

    over: function (event, ui) {
      $(this).css("box-shadow", "0px 0px 7px 8px red");
    }

  });

  // Holder droppable
  $("#tableHolder td").droppable({
    drop: function (event, ui) {
      //console.log("accept items from board");
      printErrorMessages("");

      var index = ui.draggable.attr("data-index");
      var tempIndex, row, col;

      // Display string and score
      if (index != null) {
        tempIndex = index.split("-");
        row = parseInt(tempIndex[0]);
        col = parseInt(tempIndex[1]);
        myString[row][col] = "*";
        //console.log(myString)
        if (isAdjacent(row, col)) {

          if (ui.draggable.attr("data-index") == "8-8") {
            if ($("img[data-status='on']").length > 1) {
              ui.draggable.draggable("option", "revert", true);
              myString[row][col] = ui.draggable.attr("data-name");
              printErrorMessages("Cannot take back the first tile when there are other tiles on the board.");
              return;
            }
          }

          // console.log(myString)
          $(this).css("box-shadow", "");

          $(this).attr("data-status", "on");

          // If the tile is space, take it back to the space image
          var previousLetter = ui.draggable.attr("data-previous-letter");
          if (previousLetter != null) {
            ui.draggable.attr("src", "./images/Scrabble_Tile_Blank.jpg");
            ui.draggable.attr("data-name", "Blank");
          }

          // Set position fit to the rack
          ui.draggable.css({
            position: 'relative',
            top: 0,
            left: 0
          });

          $("#tableBoard td[data-index='" + ui.draggable.attr("data-index") + "']").attr("data-status", "off");
          $("#tableBoard td[data-index='" + ui.draggable.attr("data-index") + "']").removeAttr("data-name");

          // because the tile is taken back to the rack
          // skip it to make the displayString() works correctly
          if (direction == leftRight) {
            if (myString[row][col - 1] != "*") {
              col--;
            } else if (myString[row][col + 1] != "*") {
              col++;
            }
          }

          if (direction == upDown) {
            if (myString[row + 1][col] != "*") {
              row++;
            } else if (myString[row - 1][col] != "*") {
              row--;
            }
          }
          var my_word = displayString(row, col);
          $("#myString").text("Word: " + my_word);
          $("#score").text("Score: " + score(row, col, my_word));

          // Reset conditional variable (directions)
          resetVariables();

          ui.draggable.removeAttr("data-status");
          ui.draggable.removeAttr("data-index");
          ui.draggable.removeAttr("data-previous-letter");

          $("#tableBoard td[data-status='off']").droppable('option', 'accept', "img");
        } else {
          // HERE TWO TILES ARE NOT ADJACENT       
          ui.draggable.draggable("option", "revert", true); // Go back to the rack
          myString[row][col] = ui.draggable.attr("data-name");
          printErrorMessages("Do not allow space between two letters.");
          //console.log(myString)
        }
      }
    },

    out: function (event, ui) {
      //console.log("out from holder");

      $(this).css("box-shadow", "");
    }

  });

  // Exchange tiles
  // When the players drop a tile, exchange the new tile for them
  $("#exchangeTiles").droppable({
    drop: function (event, ui) {
      //console.log("hello");
      ui.draggable.draggable("option", "revert", true);

      if (ui.draggable.attr("data-status") != "on") {
        if (ui.draggable.attr("data-name") != "Blank") {
          //console.log($("#tableHolder td").attr("data-status"))
          var randomLetter = Math.floor(Math.random() * coef);

          var nameLetter = sampleSpaceLetters[randomLetter];
          if (nameLetter != null) {
            ScrabbleTiles[nameLetter].remaining--;
            ScrabbleTiles[ui.draggable.attr("data-name")].remaining++;
            var index = sampleSpaceLetters.indexOf(nameLetter);

            // remove letter from sample space
            if (sampleSpaceLetters.length > 0) {
              sampleSpaceLetters.splice(index, 1);
              sampleSpaceLetters.splice(index, 0, ui.draggable.attr("data-name"));
              updateRemainTable();
            }

            var indexDraggable = ui.draggable.attr("data-index-holder")

            if (nameLetter != "_") {
              $("#tableHolder img[data-index-holder='" + indexDraggable + "']").attr("data-name", nameLetter);
              $("#tableHolder img[data-index-holder='" + indexDraggable + "']").attr("src", "./images/Scrabble_Tile_" + nameLetter + ".jpg");
              $("#tableHolder img[data-index-holder='" + indexDraggable + "']").removeAttr("data-status");
              $("#tableHolder img[data-index-holder='" + indexDraggable + "']").removeAttr("data-index");
            } else {
              nameLetter = "Blank";
              $("#tableHolder img[data-index-holder='" + indexDraggable + "']").attr("data-name", nameLetter);
              $("#tableHolder img[data-index-holder='" + indexDraggable + "']").attr("src", "./images/Scrabble_Tile_" + nameLetter + ".jpg");
              $("#tableHolder img[data-index-holder='" + indexDraggable + "']").removeAttr("data-status");
              $("#tableHolder img[data-index-holder='" + indexDraggable + "']").removeAttr("data-index");
            }
          } else {
            printErrorMessages("There is no more letter.");
          }
        } else {
          printErrorMessages("Cannot exchange blank tile. Please choose another one.");
        }
      } else {
        printErrorMessages("Cannot exchange the tile on the board. Take it back to the rack, then exchange it.");
      }

    },

    out: function (event, ui) {
      //console.log("out from holder");
    }

  });

  /*##################################################
   #   FUNCTIONS LOCATED HERE
   ##################################################
  */
  // reset variable (reset global variables)
  function resetVariables() {
    // Reset conditional variable (directions)
    //console.log(changeDirection)
    chosenDirection = null; // reset chosen direction
    if ($("#tableHolder td[data-status='off'").length == 0) { // all tiles on the rack
      saveCol = -1;
      saveRow = -1;

      if ($("#tableBoard td[data-save='on']").length == 0) { // No save word on the board
        startGame = false;
      }

      firstTile = false;
      acceptTile = false;
      changeDirection = true;
      direction = 0;
    }

    if ($("#tableHolder td[data-status='off'").length == 1) { // There is a first tile on the board
      saveCol = -1;
      saveRow = -1;
      acceptTile = false;
      changeDirection = true;
      if ($("#tableBoard td[data-save='on']").length == 0) { // No save word on the board
        direction = 0;
      }
    }

    if ($("#tableHolder td[data-status='on'").length == 7) { // All tiles on the board
      $("#myString").text("Word: ");
      $("#score").text("Score: 0");
    }
    //console.log(changeDirection)
  }

  /* 
  ##################################################################
  #   Check if there must be two blocks are adjacent
  #   return true if no space between two letters
  #   return false if there is space (invalid move)
  #   Idea: find the * between two letter (A*A)
  ##################################################################
  */
  function isAdjacent(row, col) {
    // Check error (no allow space between letters)
    var firstLetter = false;
    row = parseInt(row);
    col = parseInt(col);

    if (direction == leftRight) {
      var boardTDLeft = $("#tableBoard td[data-index='" + row + "-" + (col - 1) + "']");
      var boardTDRight = $("#tableBoard td[data-index='" + row + "-" + (col + 1) + "']");
      
      if (boardTDLeft.attr("data-save") == "on" && boardTDRight.attr("data-save") == "on") { // there are two letters
        return true;
      }
      for (var i = 0; i < myString.length - 1; i++) { // Skip * at begining
        if (!firstLetter) {
          if (myString[row][i] != "*") {
            firstLetter = true;
          }
        } else {
          if (myString[row][i] == "*" && myString[row][i + 1] != "*") { // check * between two letters
            return false;
          }
        }
      }
      //console.log(myString);
      return true;
    } else if (direction == upDown) {
      var boardTDUP = $("#tableBoard td[data-index='" + (row - 1) + "-" + col + "']");
      var boardTDDown = $("#tableBoard td[data-index='" + (row + 1) + "-" + col + "']");
      if (boardTDUP.attr("data-save") == "on" && boardTDDown.attr("data-save") == "on") {
        return true;
      }
      for (var i = 0; i < myString.length - 1; i++) {
        if (!firstLetter) {
          if (myString[i][col] != "*") {
            firstLetter = true;
          }
        } else {
          if (myString[i][col] == "*" && myString[i + 1][col] != "*") {
            return false;
          }
        }
      }
      //console.log(myString);
      return true;
    } else {
      return true; // first tile
    }
  }

  // update remaining table 
  function updateRemainTable() {
    var i;
    for (i = 0; i < $("#tableRemain td").length; i++) {
      var letter = Object.keys(ScrabbleTiles)[i];
      $("#tableRemain td").eq(i).text(letter + ": " + ScrabbleTiles[letter].remaining);
    }
  }

  /*
  #############################################################################################
  #   Display the word
  #############################################################################################
  #   For left-right direction:
  #   If the tile on the right, go left the memory(myString), then revert it
  #   if the tile on the left, go right the memory(myString)
  #   if the tile on the middle, go left the memory(myString) and go right the memory(myString)
  #   Then, return the string result
  ###############################################################################################   
  #   For up-down direction:
  #   If the tile up position, go down the memory(myString)
  #   if the tile down position, go up the memory(myString), then revert it
  #   if the tile on the middle, go up the memory(myString) and go down the memory(myString)
  #   Then, return the string result
  ################################################################################################
  */
  function displayString(row, col) {
    var str = "";
    // Store characters, then add them up to create the word
    var tempLeft = "";
    var tempRight = "";
    var tempUp = "";
    var tempDown = "";
    var i;
    var isStartAtMiddle = false; // use to determine if the tile is on the middel of the word
    var isRight = false; // used to determine if it reaches the right most letter
    var isLeft = false; // used to determine if it reaches the left most letter
    var isUp = false; // used to determine if it reaches the up most letter
    var isDown = false; // used to determine if it reaches the down most letter

    row = parseInt(row);
    col = parseInt(col);

    //console.log(row + ": " + col)

    // startGame
    if ($("#tableHolder td[data-status='off']").length == 1 && $("#tableBoard td[data-save='on']").length == 0) {
      if (myString[row][col] != "*" && myString[row][col] != "Blank") {
        return myString[row][col];
      }
    } else {
      if (myString[row][col] == "*") {
        return "";
      }
    }

    if (direction == leftRight) { // LEFT RIGHT
      for (i = 0; i < 15; i++) {
        if (myString[row][col + 1] != "*" && myString[row][col - 1] != "*") { // start on the middle of the word  
          isStartAtMiddle = true;
          if (myString[row][col + i] != "*" && myString[row][col] != "Blank") {
            tempRight += myString[row][col + i];
          } else {
            isRight = true;
          }

          if (myString[row][col - i] != "*" && myString[row][col] != "Blank") {
            tempLeft += myString[row][col - i];
          } else {
            isLeft = true;
          }

          if (isRight && isLeft) { // if reach left and right break the loop
            break;
          }

        } else if (myString[row][col + 1] != "*" && myString[row][col] != "Blank") { // start on the left of the word  
          if (myString[row][col + i] != "*") {
            str += myString[row][col + i];
          } else {
            break;
          }
        } else if (myString[row][col - 1] != "*" && myString[row][col] != "Blank") { // start on the right of the word  
          if (myString[row][col - i] != "*" && myString[row][col] != "Blank") {
            str += myString[row][col - i];
          } else {
            str = str.split("").reverse().join(""); // reverse because it goes from right to left
            break;
          }
        }
      }
      if (isStartAtMiddle) { // if tile is at middle of the word
        tempLeft = tempLeft.split("").reverse().join("");
        tempRight = tempRight.substring(1);
        str = tempLeft + tempRight;
      }
      return str;
    } else if (direction == upDown) { // UP DOWN
      for (i = 0; i < 15; i++) {
        if (myString[row + 1][col] != "*" && myString[row - 1][col] != "*") { // start on the middle of the word  
          isStartAtMiddle = true;
          if (myString[row + i][col] != "*" && myString[row][col] != "Blank") {
            tempDown += myString[row + i][col];
          } else {
            isDown = true;
          }

          if (myString[row - i][col] != "*" && myString[row][col] != "Blank") {
            tempUp += myString[row - i][col];
          } else {
            isUp = true;
          }

          if (isDown && isUp) {
            break;
          }

        } else if (myString[row + 1][col] != "*") {
          if (myString[row + i][col] != "*" && myString[row][col] != "Blank") { // start on the up of the word  
            str += myString[row + i][col];
          } else {
            break;
          }
        } else if (myString[row - 1][col] != "*") {
          if (myString[row - i][col] != "*" && myString[row][col] != "Blank") { // start on the down of the word  
            str += myString[row - i][col];
            //console.log(str);
          } else {
            str = str.split("").reverse().join(""); // reverse because it goes from down to up
            break;
          }
        }
      }

      if (isStartAtMiddle) {
        tempUp = tempUp.split("").reverse().join("");
        tempDown = tempDown.substring(1);
        str = tempUp + tempDown;
      }

      return str;
    } else {
      return myString[row][col]; // return a single letter
    }

  }

  /*
  ##########################################################################
  #   Determine score
  #   Used the letters are saved on the board <td> tag
  #   The tag contains two values: condition (letter or word) and x2 or x3
  #   Then calculate the score
  ##########################################################################
  */
  function score(row, col, my_word) {
    var score = 0; // score of a valid word
    var condition; // word or letter
    var wordPrice = []; // store array of x2 or x3
    var price; // x2 or x3
    var countBonus = 0; // if word has 7 letters, + 50

    //console.log(direction)
    //findWord(my_word)
    //DEBUG
    if (findWord(my_word)) {
      isValidWord = true;
      if (direction == leftRight) { // left-right
        for (i = 0; i < 15; i++) {
          if (myString[row][col + 1] != "*") { // go right
            if (myString[row][col + i] != "*" && myString[row][col] != "Blank") {
              // get value of a tile from the data structure
              var v = ScrabbleTiles[myString[row][col + i]].value;

              // Get price is saved on the <td> tag
              // dataFromTd[0]: letter or word
              // dataFromTd[1]: x2 or x3
              var dataFromTd = $("#tableBoard td[data-index='" + row + "-" + (col + i) + "']").attr("data-price");
              //console.log("value: " + v);

              if (dataFromTd != null) {
                dataFromTd = dataFromTd.split("-");
                condition = dataFromTd[0];
                price = parseInt(dataFromTd[1]);
                if (condition == "letter") {
                  score += v * price;
                  countBonus++;
                } else {
                  wordPrice.push(price);
                  score += v;
                  countBonus++;
                }
              } else {
                score += v;
                countBonus++;
              }
            } else {
              break;
            }
          }

          if (myString[row][col - 1] != "*") { // go left
            if (myString[row][col - i] != "*" && myString[row][col] != "Blank") {

              var v = ScrabbleTiles[myString[row][col - i]].value;

              var dataFromTd = $("#tableBoard td[data-index='" + row + "-" + (col - i) + "']").attr("data-price");
              //console.log("value: " + v);
              if (dataFromTd != null) {
                dataFromTd = dataFromTd.split("-");
                condition = dataFromTd[0];
                price = parseInt(dataFromTd[1]);
                if (condition == "letter") {
                  score += v * price;
                  countBonus++;
                } else {
                  wordPrice.push(price);
                  score += v;
                  countBonus++;
                }
              } else {
                score += v;
                countBonus++;
              }
            } else {
              break;
            }
          }
        }

        //console.log(score);
        //console.log(wordPrice);
        if (wordPrice.length > 0) {
          for (i = 0; i < wordPrice.length; i++) {
            score = score * parseInt(wordPrice[i]);
          }
        }
        if (countBonus == 7) {
          return score + 50;
        } else {
          return score;
        }
      } else if (direction == upDown) { // up-down
        // console.log("hello from up")
        // console.log(row + ":" + col)
        // console.log(myString)
        for (i = 0; i < 15; i++) {
          if (myString[row + 1][col] != "*") { // go down
            if (myString[row + i][col] != "*" && myString[row][col] != "Blank") {
              var v = ScrabbleTiles[myString[row + i][col]].value;

              var dataFromTd = $("#tableBoard td[data-index='" + (row + i) + "-" + col + "']").attr("data-price");
              //console.log("value: " + v);
              if (dataFromTd != null) {
                dataFromTd = dataFromTd.split("-");
                condition = dataFromTd[0];
                price = parseInt(dataFromTd[1]);
                if (condition == "letter") {
                  score += v * price;
                  countBonus++;
                } else {
                  wordPrice.push(price);
                  score += v;
                  countBonus++;
                }
              } else {
                score += v;
                countBonus++;
              }
            } else {
              break;
            }
          }

          if (myString[row - 1][col] != "*") { // go up
            if (myString[row - i][col] != "*" && myString[row][col] != "Blank") {
              var v = ScrabbleTiles[myString[row - i][col]].value;

              var dataFromTd = $("#tableBoard td[data-index='" + (row - i) + "-" + col + "']").attr("data-price");
              //console.log("value: " + v);
              if (dataFromTd != null) {
                dataFromTd = dataFromTd.split("-");
                condition = dataFromTd[0];
                price = parseInt(dataFromTd[1]);
                if (condition == "letter") {
                  score += v * price;
                  countBonus++;
                } else {
                  wordPrice.push(price);
                  score += v;
                  countBonus++;
                }
              } else {
                score += v;
                countBonus++;
              }
            } else {
              break;
            }
          }
        }

        if (wordPrice.length > 0) {
          for (i = 0; i < wordPrice.length; i++) {
            score = score * parseInt(wordPrice[i]);
          }
        }
        if (countBonus == 7) {
          return score + 50;
        } else {
          return score;
        }
      }
    } else {
      isValidWord = false;
      return 0;
    }
  }

  // Find the word in the dictionary
  // Reference from : https://johnresig.com/blog/dictionary-lookups-in-javascript/
  function findWord(word) {
    //console.log("word search: " + word);

    // If the word on the dictionary
    if (word.length > 1) {
      if (dict[word]) { // if found the word, return true
        return true;
      }
    }

    // if go here that means not found the word
    // if not, return false
    return false;
  }

  // print error messages
  function printErrorMessages(msg) {
    $("#error-message p").text(msg);
    $("#error-message p").css("color", "red");
  }
});