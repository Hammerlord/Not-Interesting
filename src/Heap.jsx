import { useEffect, useRef, useState } from "react";
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
    arrayItem: {
        display: "inline-block",
        margin: "4px",
        minWidth: "32px",
        textAlign: "center",
        verticalAlign: "top",
    },
    arrayItemInner: {
        border: "1px solid rgba(0, 0, 0, 0.2)",
        verticalAlign: "top",
        width: "100%",
        fontWeight: 600,
        padding: "8px 0",
        marginTop: "4px",
    },
});

const numItems = 12;

const Heap = () => {
    const [, setInit] = useState(false);
    const [heap] = useState(() => {
        const createdHeap = makeMinHeap();
        Array.from({ length: numItems }).forEach(() => {
            const int = getRandomInt(0, numItems);
            createdHeap.add(int);
        });

        return createdHeap;
    });
    const canvasRef = useRef();

    useEffect(() => {
        // Used to trigger rerender for ref
        setInit(true);
    }, []);

    const classes = useStyles();
    const ySpacing = 60;
    const xSpacing = 50;
    const heapArr = heap.getHeap();
    const width = (canvasRef?.current?.getBoundingClientRect && canvasRef?.current?.getBoundingClientRect()?.width) / 2 || 500;
    let level = 0;

    return (
        <div className={classes.root} ref={canvasRef}>
            <h3>Heap</h3>
            <div className={classes.arrayContainer}>
                {heapArr.map((item, i) => (
                    <div className={classes.arrayItem} key={i}>
                        <div className={classes.arrayItemIndex}>{i}</div>
                        <div className={classes.arrayItemInner}>{item}</div>
                    </div>
                ))}
            </div>
            <svg width="100%" height="100%">
                <g transform="translate(50,50)">
                    {heapArr.map((n, i) => {
                        if (isPowerOfTwo(i + 1)) {
                            ++level;
                        }

                        const lChild = heap.getLChildIndex(i);
                        const rChild = heap.getRChildIndex(i);
                        const levelAdjustment = width + xSpacing / 2 - (xSpacing * Math.pow(2, level)) / 1.3333;
                        const x = i * xSpacing + levelAdjustment;
                        const nextLevelAdjustment = width + xSpacing / 2 - (xSpacing * Math.pow(2, level + 1)) / 1.3333;
                        const y = level * ySpacing;
                        return (
                            <g key={i}>
                                {heapArr[lChild] !== undefined && (
                                    <line
                                        stroke="#444"
                                        x1={x}
                                        y1={y}
                                        x2={lChild * xSpacing + nextLevelAdjustment}
                                        y2={(level + 1) * ySpacing}
                                    />
                                )}
                                {heapArr[rChild] !== undefined && (
                                    <line
                                        stroke="#444"
                                        x1={x}
                                        y1={y}
                                        x2={rChild * xSpacing + nextLevelAdjustment}
                                        y2={(level + 1) * ySpacing}
                                    />
                                )}
                                <circle stroke={"#444"} fill="white" r="16" cx={x} cy={y}></circle>
                                <text color="black" x={x} y={y + 5} textAnchor="middle">
                                    {n}
                                </text>
                            </g>
                        );
                    })}
                </g>
            </svg>
        </div>
    );
};

export default Heap;
