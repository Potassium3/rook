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

    // Puzzle pieces, rook and rook trail
    for (let i=0; i<puzzle.pieces.length; i++) {
        let pos = puzzle.pieces[i]
        html += `<div class='puzzle-piece' id='piece-${pos[0]}-${pos[1]}' style='
            top:${(pos[0]+0.5)*100/size}%;
            left:${(pos[1]+0.5)*100/size}%;
            width:${100/size}%;'></div>`
    }

    let rookPos = puzzle.rook[puzzle.rook.length-1];
    html += `<div class='puzzle-rook' id='rook' style='
        top:${(rookPos[0]+0.5)*100/size}%;
        left:${(rookPos[1]+0.5)*100/size}%;
        width:${100/size}%;'></div>`

    mainPuzzle.innerHTML = html;
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
            console.log("this is looping");
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
    console.log(puzzle);
}

// Generating a puzzle (crude placeholder)

function r(n) {
    return Math.floor(Math.random()*n)
}

function generatePuzzle(size, pieces, solutions) {
    let puzzle = {
        size: size,
        pieces: [],
        rook: []
    }
    let currentPos = [r(size), r(size)];
    puzzle.rook = [currentPos];
    for (let i=0; i<pieces; i++) {
        if (i%2 == 0) {
            let newY = currentPos[0];
            while (newY == currentPos[0] /*|| newY == puzzle.rook[0][0] || puzzle.pieces.some(function (pos){return pos[0] == newY})*/) {
                newY = r(size);
            }
            currentPos = [newY, currentPos[1]];
        } else {
            let newX = currentPos[1];
            while (newX == currentPos[1] || newX == puzzle.rook[0][1] || puzzle.pieces.some(function (pos){return pos[1] == newX})) {
                newX = r(size);
            }
            currentPos = [currentPos[0], newX];
        }
        puzzle.pieces.push(currentPos);
    }
    return puzzle;
}

function clickButton(button, puzzle) {
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
    return puzzle;
}

let puzzle = generatePuzzle(10, 13, 1);

console.log(puzzle);
renderPuzzle(puzzle);