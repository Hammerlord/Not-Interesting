import { useState } from "react";
import { createUseStyles } from "react-jss";

const makeMinHeap = () => {
    const arr = [];

    const getLChildIndex = (i) => {
        return 2 * i + 1;
    };

    const getRChildIndex = (i) => {
        return 2 * i + 2;
    };

    const getParentIndex = (i) => {
        return Math.floor((i - 1) / 2);
    };

    const minHeapify = (i) => {
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
            const temp = arr[i];
            arr[i] = arr[smallest];
            arr[smallest] = temp;
            minHeapify(smallest);
        }
    };

    const removeMin = () => {
        if (arr.length === 0) {
            return null;
        }

        const root = arr[0];
        arr[0] = arr[arr.length - 1];
        minHeapify(0);
        return root;
    };

    const swap = (i, j) => {
        const temp = arr[i];
        arr[i] = arr[j];
        arr[j] = temp;
    };

    const add = (item) => {
        arr.push(item);
        let i = arr.length - 1;

        while (i > 0 && arr[getParentIndex(i)] > arr[i]) {
            swap(getParentIndex(i), i);
            i = getParentIndex(i);
        }
    };

    return {
        getHeap: () => arr,
        add,
        removeMin,
        getLChildIndex,
        getRChildIndex,
        getParentIndex,
    };
};

export const getRandomInt = (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

const isPowerOfTwo = (n) => n > 0 && !(n & (n - 1));

const useStyles = createUseStyles({
    root: {
        textAlign: "center",
    },
    node: {
        display: "inline-block",
        width: "15px",
        margin: "10px",
        padding: "10px",
        textAlign: "center",
        border: "1px solid rgba(0, 0, 0, 0.2)",
        borderRadius: "30px",
        verticalAlign: "top",
        fontWeight: 600,
    },
    arrayContainer: {
        marginBottom: "16px",
    },
    arrayItem: {
        display: "inline-block",
        margin: "4px",
        minWidth: "32px",
        textAlign: "center",
        verticalAlign: "top",
    },
    arrayItemIndex: {},
    arrayItemInner: {
        border: "1px solid rgba(0, 0, 0, 0.2)",
        verticalAlign: "top",
        width: "100%",
        fontWeight: 600,
        padding: "8px 0",
        marginTop: "4px",
    },
});

const Heap = () => {
    const [heap] = useState(() => {
        const createdHeap = makeMinHeap();
        Array.from({ length: 12 }).forEach(() => {
            const int = getRandomInt(0, 15);
            createdHeap.add(int);
        });

        return createdHeap;
    });

    const classes = useStyles();

    const heapLevels = (() => {
        const minHeap = heap.getHeap();
        if (minHeap.length === 0) {
            return [[]];
        }

        const levels = [];

        minHeap.forEach((item, i) => {
            if (isPowerOfTwo(i + 1)) {
                levels.push([]);
            }

            levels[levels.length - 1].push(item);
        });

        return levels;
    })();

    return (
        <div className={classes.root}>
            <h3>Heap</h3>
            <div className={classes.arrayContainer}>
                {heap.getHeap().map((item, i) => (
                    <div className={classes.arrayItem}>
                        <div className={classes.arrayItemIndex}>{i}</div>
                        <div className={classes.arrayItemInner}>{item}</div>
                    </div>
                ))}
            </div>
            {heapLevels.map((level, i) => (
                <div key={i}>
                    {level.map((item, i) => (
                        <div key={i} className={classes.node}>
                            {item}
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );
};

export default Heap;
