function r(n) {
    return Math.floor(Math.random()*n)
}

function inspectRkMove(state, size, dotsToGo, x, y) {
    if (dotsToGo < 0 || x < 0 || y < 0 || x >= size || y >= size) {
        console.error("out");
        return [];
    }
    let newState = [];
    for (let r of state) {
        let newStateRow = []
        for (let sq of r) {
            newStateRow.push(sq);
        }
        newState.push(newStateRow);
    }
    newState[y][x] = "."; // Capture the dot
    let endpoints = [];
    found = false;
    for (let checkX=0; checkX<size; checkX++) {
        if (newState[y][checkX] === "o") {
            // Found a movable-to dot
            let xEndpoints = inspectRkMove(newState, size, dotsToGo-1, checkX, y);
            found = true;
            for (let endpoint of xEndpoints) {
                endpoints.push(endpoint);
            }
        }
    }
    for (let checkY=0; checkY<size; checkY++) {
        if (newState[checkY][x] === "o") {
            // Found a movable-to dot
            let yEndpoints = inspectRkMove(newState, size, dotsToGo-1, x, checkY);
            found = true;
            for (let endpoint of yEndpoints) {
                endpoints.push(endpoint);
            }
        }
    }
    if (!found && dotsToGo<=0) {
        // If no other movable-to dots were found, this is an endpoint
        endpoints.push([x, y]);
    }
    return endpoints;
}

function calcEndpoints(state, size) {
    let x, y;
    let dotsToFind = 0;
    for (let i=0; i<size; i++) {
        for (let j=0; j<size; j++) {
            if (state[i][j] === "#") {
                x = j;
                y = i;
            } else if (state[i][j] === "o") {
                dotsToFind++;
            }
        }
    }
    return inspectRkMove(state, size, dotsToFind, x, y);
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
        if (!sqs.some((coord) => coord[0]===newX&&coord[1]===newY) && !noX.includes(newX) && !noY.includes(newY)) {
            break;
        }
    }
    if (sqs.some((coord) => coord[0]===newX) || sqs.some((coord) => coord[1]===newY)) {
        // If clashes with other dots detected
        console.log("clash");
        let c = calcEndpoints(newState, size);
        if (c.filter((coord) => coord[0]==x && coord[1]==y).length != 1) {
            // Not equal to 1 endpoint on the current square, returning...
            return [newState, "failed", []];
        }
        let numEndpoints = c.length;
        if (numEndpoints === 1) {
            // 1 endpoint
            sqs.push([newX, newY]);
            newState[newY][newX] = "o";
            return [newState, "success", [[newX, newY]]];
            // If there's 1 endpoint (hooray)
        } else if (numEndpoints === 0) {
            console.log("0 endpoints??????");
            return [newState, "failed", []];
            // If there are 0 endpoints (impossible)
        } else {
            // Rule out rows and columns of other endpoints
            for (let endpoint of c) {
                if (endpoint[0] != newX) {
                    noX.push(newX);
                }
                if (endpoint[1] != newY) {
                    noY.push(newY);
                }
            }
        }
    } else {
        console.log("no clash");
    }
    sqs.push([newX, newY]);
    returned = rkMove(newState, count-1, size, newX, newY, sqs, noX, noY);
    let result, solution;
    state = returned[0];
    result = returned[1];
    solution = returned[2];
    if (result == "success") {
        solution.push([newX, newY]);
        return [newState, "success", solution];
    } else {
        console.log("failed, looping round again")
    }
    // Loop around again
    return [newState, "failed", []]
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
    state[5][0] = "#";
    returned = rkMove(state, 6, size, 0, 5, [[0, 0]]);
    let test, solution;
    state = returned[0];
    test = returned[1];
    solution = returned[2];
    console.log("result:"+test);
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