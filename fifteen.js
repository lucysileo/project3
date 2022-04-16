var game;
document.getElementById("shuffle").style.display = "none";
let AUDIO = new Audio ('music.mp3');
AUDIO.volumne = 0.1;
if (typeof AUDIO.loop =='boolean'){
    AUDIO.loop = true;
}
else{
    AUDIO.addEventListener("reset",function(){
        this.currentTime = 0;
        this.play();
    }, false);
}


function reset(){
    document.getElementById("shuffle").style.display = "none";
    document.getElementById("play").disabled = false;
    location.reload(); 
}
function play(){
document.getElementById("shuffle").style.display = "block";
document.getElementById("play").disabled = true;
AUDIO.play();

var totalSeconds = 0;
 var timerVariable = setInterval(countUpTimer, 1000); 
function countUpTimer(){

  totalSeconds++;
  hour = Math.floor(totalSeconds / 3600);
  minute = Math.floor((totalSeconds - hour * 3600) / 60);
  seconds = totalSeconds - (hour * 3600 + minute * 60);
  document.getElementById("timer").innerHTML = hour + ":" + minute + ":" + seconds;
}


var image;
var rows= document.getElementById("size").value;
var cols = document.getElementById("size").value;

    var imageChoice = document.getElementById("picture").value ;
    if (imageChoice == "pic1") {
        image = [{
            src: 'images/koyanagi.jpg',
            title: 'Koyanagi'
        }];
    }
    if (imageChoice == "pic2") {
        image = [{
            src: 'images/edrampage.jpg',
            title: 'Edrampage'
        }];
    }
    if (imageChoice == "pic3") {
        image = [{
            src: 'images/MDZS.jpg',
            title: 'MDZS'
        }];
    }
    if (imageChoice == "pic4") {
        image = [{
            src: 'images/Curry.png',
            title: 'Curry'
        }];
    }
    var puzzle_container = document.createElement("ul");
    puzzle_container.id="puzzle_container";
    document.body.appendChild(puzzle_container);
    for(var i = 1; i < rows*cols ; i += 1) {
        var puzzle_block = document.createElement("div");
        puzzle_block.className = "puzzle_block";
        puzzle_block.innerHTML = i;
        document.getElementById("puzzle_container").appendChild(puzzle_block);
    }

    game = new Game(rows, cols, image); 
}

    
//handle the shuffle button
var shuffle_button = document.getElementById("shuffle");
shuffle_button.addEventListener('click', (e) => {
    game.shuffle(1000);
});

class Game {
    difficulty;
    cols;
    image;
    rows;
    count; //cols*rows
    blocks; //the html elements with className="puzzle_block"
    emptyBlockCoords ; //the coordinates of the empty block
    gameboard = []; //keeps track of the order of the blocks
    image;

    constructor(cols, rows, image) {
        this.cols =  cols;
        this.rows = rows;
        this.count = this.cols * this.rows;
        this.blocks = document.getElementsByClassName("puzzle_block"); // blocks is an array of multiple puzzleblock
        this.emptyBlockCoords = [this.cols-1, this.rows-1]; //by default, the empty box is set at coord [cols-1, rows-1]
        this.image = image;
        this.setImage(this.image, document.getElementById("size").value) 
        this.init();
    }

    init() { //position each block in its proper position
        //create an array of block that clickable with click event listener on each block
        for (let y = 0; y < this.rows; y++) {
            for (let x = 0; x < this.cols; x++) {
                let posId = x + y * this.cols;
                if (posId + 1 >= this.count) break;
                this.blocks[posId].style.left = x*this.blocks[posId].clientWidth + "px";
                this.blocks[posId].style.top = y*this.blocks[posId].clientWidth + "px";
                this.blocks[posId].addEventListener('click', (e) => this.onClickOnBlock(posId));
                this.gameboard.push(posId);
            }
        }

        this.gameboard.push(this.count - 1);
        this.shuffle(1000);
    }

    

    onClickOnBlock(blockIdx) { //try move block and check if puzzle was solved
        if (this.moveBlock(blockIdx)) {
            if (this.checkPuzzleSolved()) {
                setTimeout(() => alert("Puzzle Solved!!"), 600);
                countUpTimer();
                AUDIO.clear();
            }
        }
    }

    moveBlock(posId) { //moves a block and return true if the block has moved
        let blockPos = [parseInt(this.blocks[posId].style.left), parseInt(this.blocks[posId].style.top)]; //this.blocks[posId] is a html element block
        let blockWidth = this.blocks[posId].clientWidth;
        //find  block coordinate
        let blockCoords = [blockPos[0] / blockWidth, blockPos[1] / blockWidth];
        if(this.isBlockMovable(blockCoords, this.emptyBlockCoords))
        {
            // place the click block in to empty block
            this.blocks[posId].style.left = this.emptyBlockCoords[0]*this.blocks[posId].clientWidth + "px";
            this.blocks[posId].style.top = this.emptyBlockCoords[1]*this.blocks[posId].clientWidth + "px";

            //update empty block 
            this.gameboard[this.emptyBlockCoords[0] + this.emptyBlockCoords[1] * this.cols] = this.gameboard[blockCoords[0] + blockCoords[1] * this.cols];
            this.emptyBlockCoords[0] = blockCoords[0];
            this.emptyBlockCoords[1] = blockCoords[1];
            return true;
        }
        else { 
            return false;
        }
    }

    randomize(iterationCount) { //move a random block (x iterationCount)
        for (let i = 0; i < iterationCount; i++) {
            let randomBlockIdx = Math.floor(Math.random() * (this.count - 1));
            let moved = this.moveBlock(randomBlockIdx);
            if (!moved) i--;
        }
    }
    shuffle(moveCount){
        let count = 0;
        while(count<moveCount){
            let randomBlock = Math.floor(Math.random() * (this.count - 1)); //pick a random block to move
            let moved = this.moveBlock(randomBlock); //moveBlock method is already check if the block is moveable or not. if it can move, increase count by 1
            if(moved) count++;
        }
    }


    isBlockMovable(clickBlock, emptyBlock){
        //empty block should be has same x coordinate and y corrdinate +-1 or same y coordinate and x coordinate +-1  with a moveable block 
        let isNeighbor = [Math.abs(clickBlock[0] - emptyBlock[0]), Math.abs(clickBlock[1] - emptyBlock[1])];
        if((isNeighbor[0] == 1 & isNeighbor[1] == 0) || (isNeighbor[0] == 0 & isNeighbor[1] == 1)) return true;
        return false;
    }

    checkPuzzleSolved() { //return if puzzle was solved
        for (let i = 0; i < this.gameboard.length; i++) {
            if (i == this.emptyBlockCoords[0] + this.emptyBlockCoords[1] * this.cols) continue;
            if (this.gameboard[i] != i) return false;
        }
        return true;
    }
   
    
    setImage(images, gridSize) {
        var percentage = 100 / (gridSize - 1);
        var image = images[Math.floor(Math.random() * images.length)];
        var wrap = Array.from(document.getElementById('puzzle_container').children);
        for (var i = 0; i < (gridSize * gridSize ) -1 ; i++) {
            var xpos = (percentage * (i % gridSize)) + '%';
            var ypos = (percentage * Math.floor(i / gridSize)) + '%';

            let item = wrap[i];

            item.style.backgroundImage = 'url(' + image.src + ')';
            item.style.backgroundSize = (gridSize * 100) + '%';
            item.style.backgroundPosition = xpos + ' ' + ypos;
        
        }
    }
}