function r(n) {
    return Math.floor(Math.random()*n)
}

function generate(size, moves) {
    let state = [];
    for (let i=0; i<size; i++) {
        let stateRow = [];
        for (let j=0; j<size; j++) {
            stateRow.push(".");
        }
        state.push(stateRow);
    }
    let start = {x:r(size), y:r(size)};
    state[start.y][start.x] = "#";
    let sqCurrent = {x:start.x,y:start.y};
    let sqNew = {x:0,y:0};
    let filled = [[start.x, start.y]];
    for (let i=0; i<moves; i++) {
        sqNew.x = sqCurrent.x;
        sqNew.y = sqCurrent.y;
        if (i % 2 === 0) {
        }
    }

    return state;
}

function updateGrid(state) {
    const grid = document.getElementById("js-grid-fill")
    const size = state.length;
    let x = 0;
    let y = 5;
    grid.innerHTML = "";
    for (let i=0; i<size; i++) {
        grid.innerHTML += `<tr id="grid-row-${i}"></tr>`;
        let gridRow = document.getElementById("grid-row-"+i);
        for (let j=0; j<size; j++) {
            if (state[i][j] === "#") {
                gridRow.innerHTML += "<td class='sq-rook'></td>";
            } else if (state[i][j] === "o") {
                gridRow.innerHTML += "<td class='sq-dot'></td>";
            } else {
                gridRow.innerHTML += "<td></td>";
            }
        }
    }
}
let puzzle = generate(5, 8);
updateGrid(puzzle);