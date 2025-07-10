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
updateGrid([
    ".o.o.",
    "o.o.#",
    "o.o..",
    "o.o..",
    "o..o.",
]);