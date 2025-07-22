function r(n) {
    return Math.floor(Math.random()*n)
}

function inspectRkMove(state, size, x, y) {
    let newState = state.filter((_) => true);
    //newState[y][x] = "."; // Capture the dot
    let endpoints = [];
    found = false;
    for (let checkX=0; checkX<size; checkX++) {
        if (newState[y][checkX] === "o") {
            // Found a movable-to dot
            found = true;
            let xEndpoints = inspectRkMove(newState, size, checkX, y);
            for (let endpoint of xEndpoints) {
                endpoints.push(endpoint);
            }
        }
    }
    for (let checkY=0; checkY<size; checkY++) {
        if (newState[checkY][x] === "o") {
            // Found a movable-to dot
            found = true;
            let yEndpoints = inspectRkMove(newState, size, x, checkY);
            for (let endpoint of yEndpoints) {
                endpoints.push(endpoint);
            }
        }
    }
    if (!found) {
        // If no other movable-to dots were found, this is an endpoint
        endpoints.push[[x, y]]
    }
    return endpoints;
}

function calcEndpoints(state, size) {
    let x, y;
    for (let i=0; i<size; i++) {
        for (let j=0; j<size; j++) {
            if (state[i][j] === "#") {
                x = j;
                y = i;
                break;
            }
        }
    }
    return inspectRkMove(state, size, x, y);
}

function rkMove(state, count, size, x, y, sqs=[], noX=[], noY=[]) {
    let newState = state;
    let newX = x, newY = y;
    while (true) {
        if (r(2) >= 1) {
            newX = r(size);
        } else {
            newY = r(size);
        }
        if (!sqs.includes([newX, newY]) && !noX.includes(newX) && !noY.includes(newY)) {
            break;
        }
    }
    if (sqs.some((coord) => coord[0]===newX) || sqs.some((coord) => coord[1]===newY)) {
        // If clashes with other dots detected
        console.log("clash");
        let c = calcEndpoints(newState, size);
        if (c.filter((coord) => coord==[newX, newY]).length != 1) {
            console.log(c);
            console.log("Not equal to 1 endpoint on the current square, returning")
            return newState, "failed";
        }
        let numEndpoints = c.length
        if (numEndpoints === 1 && count <= 0) {
            sqs.push([newX, newY]);
            newState, result = rkMove(newState, count-1, size, newX, newY, sqs, noX, noY);
            newState[newY][newX] = "o";
            return newState, result;
        } else if (numEndpoints === 0) {
            return newState, "failed";
        } else {
            for (let endpoint of c) {
                if (endpoint != [newX, newY]) {
                    noX.push(newX);
                    noY.push(newY); // Disable columns of other possible endpoints.
                    sqs.push([newX, newY]);
                    newState, result = rkMove(newState, count-1, size, newX, newY, sqs, noX, noY);
                    newState[newY][newX] = "o";
                    return newState, result;
                }
            }
        }
    } else {
        console.log("no clash");
    }
    sqs.push([newX, newY]);
    newState, result = rkMove(newState, count-1, size, newX, newY, sqs, noX, noY);
    newState[newY][newX] = "o";
    return newState, result;
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
    state[0][0] = "#"
    let test;
    state, test = rkMove(state, 3, size, 0, 0, [0, 0]);
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