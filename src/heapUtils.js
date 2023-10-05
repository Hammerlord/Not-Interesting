export const getParentIndex = (i) => {
    return Math.floor((i - 1) / 2);
};

export const swap = ({ arr, i, j }) => {
    const temp = arr[i];
    arr[i] = arr[j];
    arr[j] = temp;
    return arr;
};

export const getLChildIndex = (i) => {
    return 2 * i + 1;
};

export const getRChildIndex = (i) => {
    return 2 * i + 2;
};

export const singleSwapDown = (arr, i) => {
    const l = getLChildIndex(i);
    const r = getRChildIndex(i);
    let smallest = i;
    if (arr[l] < arr[i]) {
        smallest = l;
    }

    if (arr[r] < arr[smallest]) {
        smallest = r;
    }

    if (smallest !== i) {
        swap({ arr, i, j: smallest });
        return smallest;
    }
};

export const addItem = (arr, item) => {
    arr.push(item);
    let i = arr.length - 1;

    while (i > 0 && arr[getParentIndex(i)] > arr[i]) {
        swap({ arr, i, j: getParentIndex(i) });
        i = getParentIndex(i);
    }
};

export const pop = (arr) => {
    const newArr = [...arr];
    if (newArr.length > 0) {
        newArr[0] = newArr.pop();
    }

    return newArr;
};

export const singleSwapUp = (heap, i) => {
    if (i > 0 && heap[getParentIndex(i)] > heap[i]) {
        swap({ arr: heap, j: getParentIndex(i), i });
        i = getParentIndex(i);
    }

    return i;
};

export const hasLargerAncestor = (heap, i) => {
    let j = i;
    while (j > 0) {
        j = getParentIndex(j);
        if (heap[j] > heap[i]) {
            return true;
        }
    }

    return false;
};