function renderPuzzle(puzzle) {
    let mainPuzzle = document.getElementById("main-puzzle");
    let size = 10;
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

    html += "<div class='puzzle-rook' style='top:0;left:0;width:20px;'></div>"


    mainPuzzle.innerHTML = html;
}

let puzzle;

renderPuzzle(puzzle)