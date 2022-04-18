var game;
var totalSeconds = 0;
var timerVar;
var AUDIO = new Audio ("music.mp3");
document.getElementById("shuffle").style.display = "none";

AUDIO.volumne = 0.1;
    if (typeof AUDIO.loop =="boolean"){
        AUDIO.loop = true;
    }
    else{
        AUDIO.addEventListener("reset",function(){
            currentTime = 0;
            play();
    }, false);
    }

/*
 * Reset the game
*/
function reset(){
    document.getElementById("shuffle").style.display = "none";
    document.getElementById("play").disabled = false;
    location.reload();
}

/*
* Play game 
* set time count up
* set music
* shuffle tiles
* create some diffirent image and size
*
*/
function play(){

document.getElementById("time").style.display = "block";
document.getElementById("shuffle").style.display = "block";
document.getElementById("play").disabled = true;
AUDIO.play();
timerVar = setInterval(countTimer, 1000);

function countTimer() {
    ++totalSeconds;
        var hr = Math.floor(totalSeconds /3600);
        var min = Math.floor((totalSeconds - hr*3600)/60);
        var sec = totalSeconds - (hr*3600 + min*60);
            if(hr < 10){
                hr = "0"+hr;}
            if(min < 10){
                min = "0"+min;}
            if(sec < 10){
                sec = "0"+sec;}
document.getElementById("timer").innerHTML = hr + ":" + min + ":" + sec;
}

/*
 * picture option
 * size option
*/
var image;
var rows= document.getElementById("size").value;
var cols = document.getElementById("size").value;

    var imageChoice = document.getElementById("picture").value ;
    if (imageChoice == "pic1") {
        image = [{
            src: "images/koyanagi.jpg",
            title: "Koyanagi"
        }];
    }
    if (imageChoice == "pic2") {
        image = [{
            src: "images/sonic.jpg",
            title: "Sonic"
        }];
    }
    if (imageChoice == "pic3") {
        image = [{
            src: "images/MDZS.jpg",
            title: "MDZS"
        }];
    }
    if (imageChoice == "pic4") {
        image = [{
            src: "images/birdd.jpg",
            title: "Curry"
        }];
    }
    var tile_con = document.createElement("ul");
    tile_con.id="tile_con";
    document.body.appendChild(tile_con);
    for(var i = 1; i < rows*cols ; i += 1) {
        var tiles = document.createElement("div");
        tiles.className = "tiles";
        tiles.innerHTML = i;
        document.getElementById("tile_con").appendChild(tiles);
    }

    game = new Game(rows, cols, image);

}

//the shuffle button
var shuffle_button = document.getElementById("shuffle");
shuffle_button.addEventListener("click", (e) => {
    game.shuffle(1000);
});



class Game {
    image;
    cols;
    rows;
    count; //cols*rows
    tiles; //the html elements with className="tiles"
    emTileCoor ; //the coordinates of the empty block
    gameboard = []; //keeps track of the order of the tiles
    image;
/*
 *
 * tiles is an array of multiple puzzleblock
 * emTileCoor by default, the empty box is set at coord [cols-1, rows-1]
 *
*/
    constructor(cols, rows, image) {
        this.cols =  cols;
        this.rows = rows;
        this.count = this.cols * this.rows;
        this.tiles = document.getElementsByClassName("tiles");
        this.emTileCoor = [this.cols-1, this.rows-1];
        this.image = image;
        this.setImage(this.image, document.getElementById("size").value)
        this.init();
    }
/*
 * position each block in its proper position
 * create an array of block that clickable
 with click event listener on each block
 *
*/
    init() {
      for (let y = 0; y < this.rows; y++) {
         for (let x = 0; x < this.cols; x++) {
          let posId = x + y * this.cols;
          if (posId + 1 >= this.count) break;
          this.tiles[posId].style.left = x*this.tiles[posId].clientWidth + "px";
          this.tiles[posId].style.top = y*this.tiles[posId].clientWidth + "px";
     this.tiles[posId].addEventListener("click",(e)=>this.onClickOnTile(posId));
          this.gameboard.push(posId);
            }
        }

        this.gameboard.push(this.count - 1);
        this.shuffle(1000);
        var tiles_block = Array.from(document.getElementsByClassName("tiles"));
        tiles_block.forEach((elem) => {
            //this.tiles[posId] is a html element block
            let tilePos = [parseInt(elem.style.left), parseInt(elem.style.top)];
            let tileWidth = elem.clientWidth;
            //find  block coordinate
            let tileCoor = [tilePos[0] / tileWidth, tilePos[1] / tileWidth];
            if(this.isTileMovable(tileCoor, this.emTileCoor)){
            elem.addEventListener("mouseover",  function() {
                elem.style.borderColor = "red";
                elem.style.color = "#006600";
                elem.style.textDecoration = "underline"
                elem.style.cursor = "pointer";
            });
            elem.addEventListener("mouseout",  function() {
                elem.style.borderColor = "";
                elem.style.color = "black";
                elem.style.textDecoration = ""
                elem.style.cursor = "";
            });
        }
        else{
            elem.addEventListener("mouseover",  function() {
                elem.style.borderColor = "";
                elem.style.color = "black";
                elem.style.textDecoration = ""
                elem.style.cursor = "";
            });
        }
        });
    }

    /*
     * try move block and check if puzzle was solved
     * this.tiles[posId] is a html element block
    */
    onClickOnTile(posId) {
        if (this.moveTile(posId)) {
         var tiles_block = Array.from(document.getElementsByClassName("tiles"));
            tiles_block.forEach((elem) => {
            let tilePos = [parseInt(elem.style.left), parseInt(elem.style.top)];
                let tileWidth = elem.clientWidth;
                //find  block coordinate
                let tileCoor = [tilePos[0] / tileWidth, tilePos[1] / tileWidth];
                if(this.isTileMovable(tileCoor, this.emTileCoor)){
                elem.addEventListener("mouseover",  function() {
                    elem.style.borderColor = "red";
                    elem.style.color = "#006600";
                    elem.style.textDecoration = "underline"
                    elem.style.cursor = "pointer";
                });
                elem.addEventListener("mouseout",  function() {
                    elem.style.borderColor = "";
                    elem.style.color = "black";
                    elem.style.textDecoration = ""
                    elem.style.cursor = "";
                });
            }
            else{
                elem.addEventListener("mouseover",  function() {
                    elem.style.borderColor = "";
                    elem.style.color = "black";
                elem.style.textDecoration = ""
                elem.style.cursor = "";
                });
            }
            });
            if (this.checkPuzzleSolved()) {
                setTimeout(() => alert("You won!!! Reset and play agian"), 600);
            }
        }
    }
    /*
    * moves a block and return true if the block has moved
    * this.tiles[posId] is a html element block
    */
    moveTile(posId) {
        let tilePos=[parseInt(this.tiles[posId].style.left),
                     parseInt(this.tiles[posId].style.top)];
        let tileWidth = this.tiles[posId].clientWidth;
        // //find  block coordinate
        let tileCoor = [tilePos[0] / tileWidth, tilePos[1] / tileWidth];
        if(this.isTileMovable(tileCoor,this.emTileCoor))
        {
            // place the click block in to empty block
            this.tiles[posId].style.left = this.emTileCoor[0]
                *this.tiles[posId].clientWidth + "px";
            this.tiles[posId].style.top = this.emTileCoor[1]
                *this.tiles[posId].clientWidth + "px";

            //update empty block
            this.gameboard[this.emTileCoor[0] + this.emTileCoor[1] * this.cols]
            = this.gameboard[tileCoor[0] + tileCoor[1] * this.cols];
            this.emTileCoor[0] = tileCoor[0];
            this.emTileCoor[1] = tileCoor[1];
            return true;
        }
        else {
            return false;
        }
    }

    /*
     * pick a random block to move
     * moveTile method is already check if the tile is moveable or not.
     * if it can move, increase count by 1
     * change border to red, underline text and green color,
     * cursor pointer for tile can move
    */
    shuffle(moveCount){
        let count = 0;
        while(count<moveCount){
            let randTile = Math.floor(Math.random() * (this.count - 1));
            let moved = this.moveTile(randTile);
            if(moved) count++;
        }
        var tiles_block = Array.from(document.getElementsByClassName("tiles"));
        tiles_block.forEach((elem) => {
            //this.tiles[posId] is a html element block
            let tilePos = [parseInt(elem.style.left), parseInt(elem.style.top)];
            let tileWidth = elem.clientWidth;
            //find  block coordinate
            let tileCoor = [tilePos[0] / tileWidth, tilePos[1] / tileWidth];
            if(this.isTileMovable(tileCoor, this.emTileCoor)){
            elem.addEventListener("mouseover",  function() {
                elem.style.borderColor = "red"; //change border black to red
                elem.style.color = "#006600"; //change text to green
                elem.style.textDecoration = "underline" //underline text
                elem.style.cursor = "pointer"; //cursor
            });
            elem.addEventListener("mouseout",  function() {
                elem.style.borderColor = "";
                elem.style.color = "black";
                elem.style.textDecoration = "";
                elem.style.cursor = "";
            });
        }
        else{
            elem.addEventListener("mouseover",  function() {
                elem.style.borderColor = "";
                elem.style.color = "black";
                elem.style.textDecoration = ""
                elem.style.cursor = "";
            });
        }
        });
    }

    /*
     * empty block should be has same x coordinate and y corrdinate +-1
     * or same y coordinate and x coordinate +-1  with a moveable block
    */
    isTileMovable(clickTile, emTile){

        let isNext = [Math.abs(clickTile[0] - emTile[0]),
                      Math.abs(clickTile[1] - emTile[1])];
        if((isNext[0] == 1 & isNext[1] == 0) || (isNext[0] == 0&isNext[1] == 1))
            return true;
        return false;
    }

    /*
     * return if puzzle was solved
     * stop time count and music
    */
    checkPuzzleSolved() {
        for (let i = 0; i < this.gameboard.length; i++) {
            if (i == this.emTileCoor[0] + this.emTileCoor[1] * this.cols)
                continue;
            if (this.gameboard[i] != i) return false;
        }
        clearInterval(timerVar);
        AUDIO.pause();
        AUDIO.currentTime = 0;
        return true;
    }

    setImage(images, gridSize) {
        var percentage = 100 / (gridSize - 1);
        var image = images[Math.floor(Math.random() * images.length)];
        var wrap = Array.from(document.getElementById("tile_con").children);
        for (var i = 0; i < (gridSize * gridSize ) -1 ; i++) {
            var xpos = (percentage * (i % gridSize)) + "%";
            var ypos = (percentage * Math.floor(i / gridSize)) + "%";

            let item = wrap[i];

            item.style.backgroundImage = "url(" + image.src + ")";
            item.style.backgroundSize = (gridSize * 100) + "%";
            item.style.backgroundPosition = xpos + " " + ypos;

        }
    }
}