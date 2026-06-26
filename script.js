// Function to render a new puzzle on the grid
function renderPuzzle(puzzle) {
    const cellborder = 2;
    let mainPuzzle = document.getElementById("main-puzzle");
    let size = puzzle.size;
    let html = "";

    // Background grid
    html += "<div class='puzzle-grid'>";
    for (let y=0; y<size; y++) {
        html += "<div class='puzzle-row'>";
        for (let x=0; x<size; x++) {
            html += "<div class='puzzle-cell'></div>"
        }
        html += "</div>";
    }
    html += "</div>";
    mainPuzzle.innerHTML = html;

    // Initialising pieces
    for (let i=0; i<puzzle.pieces.length; i++) {
        let pos = puzzle.pieces[i]
        let piece = document.createElement("div");
        piece.className = "puzzle-piece";
        piece.id = `piece-${pos[0]}-${pos[1]}`;
        piece.style.top = `${(pos[0]+0.5)*100/size}%`;
        piece.style.left = `${(pos[1]+0.5)*100/size}%`;
        piece.style.width = `${100/size}%`;
        mainPuzzle.appendChild(piece);
        
        // Clicking on a puzzle piece to move there
        document.getElementById(`piece-${pos[0]}-${pos[1]}`).addEventListener("click", function() {
            clickPiece(`${pos[0]}`, `${pos[1]}`);
        })
    }

    // Initialising rook
    let rookPos = puzzle.rook[puzzle.rook.length-1];
    let rook = document.createElement("div");
    rook.className = "puzzle-rook";
    rook.id = "rook";
    rook.style.top = `${(rookPos[0]+0.5)*100/size}%`;
    rook.style.left = `${(rookPos[1]+0.5)*100/size}%`;
    rook.style.width = `${100/size}%`
    mainPuzzle.appendChild(rook);

    // Clicking on the rook to go back
    document.getElementById("rook").addEventListener("click", clickRook);
}

// Function to update the puzzle grid by reusing the elements already there
function updatePuzzle(puzzle) {
    let mainPuzzle = document.getElementById("main-puzzle");
    let size = puzzle.size;
    let rookPos = puzzle.rook[puzzle.rook.length-1];

    // Rook moves smoothly to next position
    document.getElementById("rook").style.top = `${(rookPos[0]+0.5)*100/size}%`;
    document.getElementById("rook").style.left = `${(rookPos[1]+0.5)*100/size}%`;
    document.getElementById("rook").style.width = `${100/size}%`;
    
    // Pieces shrink smoothly when captured
    for (let i=0; i<puzzle.pieces.length; i++) {
        let piece = puzzle.pieces[i]
        if (puzzle.rook.some(function(coord) {return coord[0] == piece[0] && coord[1] == piece[1]})) {
            document.getElementById(`piece-${piece[0]}-${piece[1]}`).style.width = 0;
            // Remove captured pieces
        } else {
            document.getElementById(`piece-${piece[0]}-${piece[1]}`).style.width = `${100/size}%`;
            // Recreate regurgitated pieces
        }
    }

    // Rook trail expands when moved
    if (puzzle.rook.length > 1) {
        for (let i=0; i<puzzle.rook.length-1; i++) { // Note -1 because .rook[i+1] is used
            let start = puzzle.rook[i];
            let end = puzzle.rook[i+1];
            if (!mainPuzzle.contains(document.getElementById(`trail-${i}`))) {
                let newTrail = document.createElement("div");
                newTrail.id = `trail-${i}`;

                let direction;
                if (start[0] == end[0]) {
                    // Y coord equal - moved horizontally
                    if (start[1] < end[1]) {
                        direction = "right"
                    } else {
                        direction = "left"
                    }
                    newTrail.style.width = `${(Math.abs(start[1]-end[1]))*100/size}%`;
                } else {
                    if (start[0] < end[0]) {
                        direction = "down"
                    } else {
                        direction = "up"
                    }
                    newTrail.style.height = `${(Math.abs(start[0]-end[0]))*100/size}%`;
                }
                newTrail.className = `puzzle-trail puzzle-trail-${direction}`;
                newTrail.style.top = `${(start[0]+0.5)*100/size}%`;
                newTrail.style.left = `${(start[1]+0.5)*100/size}%`;
                mainPuzzle.appendChild(newTrail);
            }
        }
    }
    // Rook trail retracts when moved back
    let i = puzzle.rook.length-1;
    while (mainPuzzle.contains(document.getElementById(`trail-${i}`))) {
        document.getElementById(`trail-${i}`).remove();
        i++;
    }

    // Save progress in rpu-progress (localStorage)
    window.localStorage.setItem("rpu-progress", JSON.stringify(puzzle));

    // If puzzle has been completed
    if (puzzle.rook.length == puzzle.pieces.length+1) {
        console.log("Finished!");
        window.location.href = "#";
    }
}

// Functions to generate a puzzle
function r(last) {
    return 4*last*(1-last);
}

function between(x, value, y) {
    console.log(x, value, y);
    return (x>=value && value>=y) || (x<=value && value<=y);
}

// Recursive algorithm for rook route choosing
function route(x, y, size, pieces, solutions, complexity, randomKey, pieceList=[[y, x]], lastVertical=false, originalPos=[-1, -1]) {

    // Store original start position for use over all depths of the function
    let original = [0, 0];
    if (originalPos[0] == -1) {
        original = [x, y];
        console.log("s"+original[0])
    } else {
        original = originalPos;
    }

    console.log(pieces);
    let newPieceList = pieceList;
    if (pieces == 0) {
        return [true, pieceList]; // Returns status of recursive branch and list of pieces if successful
    }

    let currentKey = randomKey;
    currentKey = r(currentKey);
    let vertical = currentKey >= 0.5; // Perpendicular direction each move (for now)
    if (vertical) {
        // Vertical movement
        let newY = 0;
        if (lastVertical) {
            let resolved = false;
            let returned = [false, []]
            let j = 0;
            while (!resolved) {
                let i = 0;
                while (newY == y || newY == original[1] || pieceList.some(function(piece){return piece[0] == newY}) || (pieceList.length >= 2 && between(pieceList[pieceList.length-1][0], newY, pieceList[pieceList.length-2][0]))) { 
                    // Stricter condition: cannot be placed in between the last piece and the second last
                    currentKey = r(currentKey);
                    newY = Math.floor(currentKey*size); // Pick random y until valid
                    console.log("choosing y");
                    i++;
                    if (i == 10) {
                        return [false, null]; // Tried too many times, must be impossible
                    }
                }
                console.log("y chosen");
                newPieceList.push([newY, x]); // Move
                console.log(JSON.stringify([newY, x]));
                returned = route(x, newY, size, pieces-1, solutions, complexity, currentKey, newPieceList, vertical, original);
                resolved = returned[0]; // If resolved, possible puzzle route found in this branch of recursive func
                if (!resolved && j>=10) {
                    newPieceList.pop();
                    return [false, null];
                }
                j++;
            }
            return [true, returned[1]];
        } else {
            let resolved = false;
            let returned = [false, []]
            let j = 0;
            while (!resolved) {
                let i = 0;
                while (newY == y || newY == original[1] || pieceList.some(function(piece){return piece[0] == newY})) { 
                    // Stricter conditions to be applied on parallel directions
                    currentKey = r(currentKey);
                    newY = Math.floor(currentKey*size); // Pick random y until valid
                    console.log("choosing y");
                    i++;
                    if (i == 10) {
                        return [false, null]; // Tried too many times, must be impossible
                    }
                }
                console.log("y chosen");
                newPieceList.push([newY, x]); // Move
                console.log(JSON.stringify([newY, x]));
                returned = route(x, newY, size, pieces-1, solutions, complexity, currentKey, newPieceList, vertical, original);
                resolved = returned[0]; // If resolved, possible puzzle route found in this branch of recursive func

                if (!resolved && j>=10) {
                    newPieceList.pop();
                    return [false, null];
                }
                j++;
            }
            return [true, returned[1]];
        }
    } else {
        let newX = 0;
        // Horizontal movement
        if (lastVertical) {
            let resolved = false;
            let returned = [false, []]
            let j = 0;
            while (!resolved) {
                let i = 0;
                while (newX == x || newX == original[0] || pieceList.some(function(piece){return piece[1] == newX})) { 
                    // Stricter conditions to be applied on parallel directions
                    currentKey = r(currentKey);
                    newX = Math.floor(currentKey*size); // Pick random x until valid
                    console.log("choosing x");
                    i++;
                    if (i == 10) {
                        return [false, null]; // Tried too many times, must be impossible
                    }
                }
                console.log("x chosen");
                newPieceList.push([y, newX]); // Move
                console.log(JSON.stringify([y, newX]));
                returned = route(newX, y, size, pieces-1, solutions, complexity, currentKey, newPieceList, vertical, original);
                resolved = returned[0]; // If resolved, possible puzzle route found in this branch of recursive func
                if (!resolved && j>=10) {
                    newPieceList.pop();
                    return [false, null];
                }
                j++;
            }
            return [true, returned[1]];
        } else {
            let resolved = false;
            let returned = [false, []]
            let j = 0;
            while (!resolved) {
                let i = 0;
                while (newX == x || newX == original[0] || pieceList.some(function(piece){return piece[1] == newX}) || (pieceList.length >= 2 && between(pieceList[pieceList.length-1][1], newX, pieceList[pieceList.length-2][1]))) { 
                    // Stricter conditions to be applied on parallel directions
                    currentKey = r(currentKey);
                    newX = Math.floor(currentKey*size); // Pick random x until valid
                    console.log("choosing x");
                    i++;
                    if (i == 10) {
                        return [false, null]; // Tried too many times, must be impossible
                    }
                }
                console.log("x chosen");
                newPieceList.push([y, newX]); // Move
                console.log(JSON.stringify([y, newX]));
                returned = route(newX, y, size, pieces-1, solutions, complexity, currentKey, newPieceList, vertical, original);
                resolved = returned[0]; // If resolved, possible puzzle route found in this branch of recursive func
                
                if (!resolved && j>=10) {
                    newPieceList.pop();
                    return [false, null];
                }
                j++;
            }
            return [true, returned[1]];
        }
    }
}

function generatePuzzle(size, pieces, solutions, complexity, randomKey) {
    let currentKey = randomKey; // Pseudorandom start number
    let puzzle = {
        size: size,
        pieces: [],
        rook: [],
        key: randomKey
    }
    let y = currentKey = r(currentKey);
    let x = currentKey = r(currentKey);
    x = Math.floor(x*size);
    y = Math.floor(y*size);
    let currentPos = [y, x];
    puzzle.rook = [currentPos];
    let generated = route(x, y, size, pieces, solutions, complexity, randomKey);
    puzzle.pieces = generated[1];

    return puzzle;
}

function clickButton(button, puzzle, keyboardcommands=false) {
    let rookX = puzzle.rook[puzzle.rook.length-1][1]
    let rookY = puzzle.rook[puzzle.rook.length-1][0]
    if (button == "up") {
        let searchY = rookY;
        searchY--; // Move first then check
        while (searchY >= 0 && 
            (!puzzle.pieces.some(function(coord){return coord[0] == searchY && coord[1] == rookX})
            || puzzle.rook.some(function(coord){return coord[0] == searchY && coord[1] == rookX}))
        ) {
            // While there isn't a piece there or a captured piece was previously there
            // (And obviously that the rook hasn't escaped off the board)
            searchY--;
            // Move up one cell at a time until a non-captured puzzle piece is reached
        }
        if (searchY >= 0) { // If there is a piece above the rook
            puzzle.rook.push([searchY, rookX]);
        }
    } else if (button == "down") {
        let searchY = rookY;
        searchY++; // Move first then check
        while (searchY < puzzle.size && 
            (!puzzle.pieces.some(function(coord){return coord[0] == searchY && coord[1] == rookX})
            || puzzle.rook.some(function(coord){return coord[0] == searchY && coord[1] == rookX}))
        ) {
            searchY++;
            // Move up one cell at a time until a puzzle piece is reached
        }
        if (searchY < puzzle.size) { // If there is a piece above the rook
            puzzle.rook.push([searchY, rookX]);
        }
    } else if (button == "right") {
        let searchX = rookX;
        searchX++; // Move first then check
        while (searchX < puzzle.size &&
            (!puzzle.pieces.some(function(coord){return coord[0] == rookY && coord[1] == searchX})
            || puzzle.rook.some(function(coord){return coord[0] == rookY && coord[1] == searchX}))
        ) {
            searchX++;
            // Move up one cell at a time until a puzzle piece is reached
        }
        if (searchX < puzzle.size) { // If there is a piece to the right of the rook
            puzzle.rook.push([rookY, searchX]);
        }
    } else if (button == "left") {
        let searchX = rookX;
        searchX--; // Move first then check
        while (searchX >= 0 && 
            (!puzzle.pieces.some(function(coord){return coord[0] == rookY && coord[1] == searchX})
            || puzzle.rook.some(function(coord){return coord[0] == rookY && coord[1] == searchX}))
        ) {
            searchX--;
            // Move up one cell at a time until a puzzle piece is reached
        }
        if (searchX >= 0) { // If there is a piece to the left of the rook
            puzzle.rook.push([rookY, searchX]);
        }
    } else {
        if (puzzle.rook.length > 1) {
            puzzle.rook.pop()
        }
    }

    let classes = document.querySelector("html").classList;
    if (keyboardcommands) {
        if (!classes.contains("keyboardcommands")) {
            classes.add("keyboardcommands");
        }
    } else {
        if (classes.contains("keyboardcommands")) {
            classes.remove("keyboardcommands");
        }
    }
    document.querySelector("html").classList = classes;

    return puzzle;
}

function clickPiece(y, x) {
    // Uses the global puzzle
    let rookPos = puzzle.rook[puzzle.rook.length-1]
    if (x == rookPos[1]) {
        // Vertical movement
        if (y > rookPos[0]) {
            clickButton("down", puzzle, false);
        } else {
            clickButton("up", puzzle, false);
        }
    } else if (y == rookPos[0]) {
        // Horizontal movement
        if (x > rookPos[1]) {
            clickButton("right", puzzle, false);
        } else {
            clickButton("left", puzzle, false);
        }
    }
    updatePuzzle(puzzle);
}

function clickRook() {
    // Uses the global puzzle
    puzzle = clickButton("back", puzzle, false);
    updatePuzzle(puzzle);
}

// Arrow key movement
document.querySelector("html").addEventListener("keyup", (event) => {
    if (event.key == "ArrowDown") {
        puzzle = clickButton('down', puzzle, true);
        updatePuzzle(puzzle);
    } else if (event.key == "ArrowUp") {
        puzzle = clickButton('up', puzzle, true);
        updatePuzzle(puzzle);
    } else if (event.key == "ArrowLeft") {
        puzzle = clickButton('left', puzzle, true);
        updatePuzzle(puzzle);
    } else if (event.key == "ArrowRight") {
        puzzle = clickButton('right', puzzle, true);
        updatePuzzle(puzzle);
    } else if (event.key == "Backspace") {
        puzzle = clickButton('back', puzzle, true);
        updatePuzzle(puzzle);
    }
});

// This code makes the puzzle key from the date so the puzzles are the same everywhere
/*
let date = Math.floor(new Date().getTime()/86400000);
let masterKey = 10.94823937; // Key for all puzzles - creates element of chaos
let key = (date%masterKey)/masterKey;
*/
let key = Math.random();

console.log("Puzzle generator unique key:");
console.log(String(key))
let puzzle = generatePuzzle(10, 10, 1, 5, key);
console.log("Puzzle info (including solution):");
console.log(puzzle);
renderPuzzle(puzzle); // Set up board
updatePuzzle(puzzle);

let savedPuzzle = window.localStorage.getItem("rpu-progress");
if (savedPuzzle && JSON.parse(savedPuzzle).key == puzzle.key) { // If puzzle progress is saved and the puzzle hasn't changed
    puzzle = JSON.parse(savedPuzzle); // Load progress into puzzle
    updatePuzzle(puzzle); // Update board with progress
}