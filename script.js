function updateGrid() {
    const grid = document.getElementById("js-grid-fill")
    const size = 10;
    let x = 0;
    let y = 5;
    grid.innerHTML = "";
    for (let i=0; i<size; i++) {
        grid.innerHTML += `<tr id="grid-row-${i}"></tr>`;
        let gridRow = document.getElementById("grid-row-"+i);
        for (let j=0; j<size; j++) {
            if (i === y && j === x) {
                gridRow.innerHTML += "<td class='sq-rook'></td>";
            } else if (Math.random() > 0.5) {
                gridRow.innerHTML += "<td class='sq-dot'></td>";
            } else {
                gridRow.innerHTML += "<td></td>";
            }
        }
    }
}
updateGrid();