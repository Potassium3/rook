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
        html += `<div class='puzzle-rook' style='top:${(pos[0]+0.5)*100/size}%;left:${(pos[1]+0.5)*100/size}%;'></div>`
    }

    mainPuzzle.innerHTML = html;
}

function r(n) {
    return Math.floor(Math.random()*n)
}

let size = 10;
let puzzle = {
    size: size,
    pieces: [],
    rook: []
};
let pieces = 5;

for (let i=0; i<pieces; i++) {
    puzzle.pieces.push([r(size), r(size)])
}

renderPuzzle(puzzle)