var SortState = {
    aktState: 0,
    key: "",
    last: ""
}

function setSortState(aktState, key) {
    SortState.aktState = aktState;
    SortState.key = key;
}

function setSortStateLast(last) {
    SortState.last = last;
}

function getSortState() {
    return SortState;
}

export {setSortState, getSortState, setSortStateLast}