function gridFill() {
    const grid = document.getElementById("js-grid-fill")
    const size = 10;
    grid.innerHTML = "";
    for (let i=0; i<size; i++) {
        grid.innerHTML += `<tr id="grid-row-${i}"></tr>`;
        let gridRow = document.getElementById("grid-row-"+i);
        for (let j=0; j<size; j++) {
            gridRow.innerHTML += "<td></td>";
        }
    }
}
gridFill();