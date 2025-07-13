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
    let sqStart = {x:r(size), y:r(size)};
    state[sqStart.y][sqStart.x] = "#";
    let sqCurrent = {x:sqStart.x,y:sqStart.y};
    let sqNew = {x:0,y:0};
    let filled = {x:[sqStart.x], y:[sqStart.y]};
    for (let i=0; i<moves; i++) {
        sqNew.x = sqCurrent.x;
        sqNew.y = sqCurrent.y;
        if (i % 2 === 0) {
            while (filled.x.includes(sqNew.x)) {
                sqNew.x = r(size);
            }
            filled.x.push(sqNew.x);
        } else {
            while (filled.y.includes(sqNew.y)) {
                sqNew.y = r(size);
            }
            filled.y.push(sqNew.y);
        }
        sqCurrent.x = sqNew.x;
        sqCurrent.y = sqNew.y;
        state[sqCurrent.y][sqCurrent.x] = "o";
    }

    return state;
}

function updateGrid(state) {
    const grid = document.getElementById("js-grid-fill")
    const size = state.length;
    grid.innerHTML = "";
    for (let i=0; i<size; i++) {
        grid.innerHTML += `<tr id="grid-row-${i}"></tr>`;
        let gridRow = document.getElementById("grid-row-"+i);
        for (let j=0; j<size; j++) {
            let sqClass = ((i+j)%2===0) ? "sq-0" : "sq-1";
            if (state[i][j] === "#") {
                gridRow.innerHTML += `<td class='sq-rook ${sqClass}' onclick='sqClick(${i},${j})'></td>`;
            } else if (state[i][j] === "o") {
                gridRow.innerHTML += `<td class='sq-dot ${sqClass}' onclick='sqClick(${i},${j})'></td>`;
            } else {
                gridRow.innerHTML += `<td class='${sqClass}' onclick='sqClick(${i},${j})'></td>`;
            }
        }
    }
}
let puzzle = generate(10, 16);

updateGrid(puzzle);