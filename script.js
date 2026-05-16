function renderPuzzle(puzzle) {
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

    // Rook and other elements
    for (let i=0; i<puzzle.pieces.length; i++) {
        let pos = puzzle.pieces[i]
        html += `<div class='puzzle-piece' style='top:${(pos[0]+0.5)*100/size}%;left:${(pos[1]+0.5)*100/size}%;'></div>`
    }

    let rookPos = puzzle.rook[0]
    html += `<div class='puzzle-rook' style='top:${(rookPos[0]+0.5)*100/size}%;left:${(rookPos[1]+0.5)*100/size}%;'></div>`

    mainPuzzle.innerHTML = html;
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
            while (newY == currentPos[0] || newY == puzzle.rook[0][0] || puzzle.pieces.some(function (pos){return pos[0] == newY})) {
                console.log(puzzle.pieces.some(function (pos){return pos[0] == newY}))
                newY = r(size);
            }
            currentPos = [newY, currentPos[1]];
        } else {
            let newX = currentPos[1];
            while (newX == currentPos[1] || newX == puzzle.rook[0][1] || puzzle.pieces.some(function (pos){return pos[1] == newX})) {
                console.log(puzzle.pieces.some(function (pos){return pos[1] == newX}))
                newX = r(size);
            }
            currentPos = [currentPos[0], newX];
        }
        console.log(currentPos);
        puzzle.pieces.push(currentPos);
    }
    return puzzle;
}

let puzzle = generatePuzzle(8, 12, 1);
renderPuzzle(puzzle);