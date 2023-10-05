import { useEffect, useRef, useState } from "react";
import { createUseStyles } from "react-jss";
import { addItem, getLChildIndex, getRChildIndex, singleSwapUp } from "./heapUtils";

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

const numItems = 5;

const Heap = () => {
    const [indicesToSwapUp, setIndicesToSwapUp] = useState([]);
    const [heap, setHeap] = useState([]);
    const canvasRef = useRef();

    useEffect(() => {
        const createdHeap = [];
        Array.from({ length: numItems }).forEach(() => {
            const int = getRandomInt(0, 15);
            addItem(createdHeap, int);
        });

        setHeap(createdHeap);
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            const newIndicesToHeap = [];
            const newHeap = [...heap];
            indicesToSwapUp.forEach((i) => {
                const newIndex = singleSwapUp(newHeap, i);
                if (newIndex !== i) {
                    // If it moved, then check if it needs to be heapified again
                    // Known issue: heap can be stuck in the wrong order when multiple numbers are added and one swaps before the other
                    newIndicesToHeap.push(newIndex);
                }
            });

            setHeap(newHeap);
            setIndicesToSwapUp(newIndicesToHeap);
        }, 500);

        return () => clearInterval(interval);
    }, [indicesToSwapUp, heap]);

    const classes = useStyles();
    const ySpacing = 60;
    const xSpacing = 50;
    const halfAreaWidth = (canvasRef?.current?.getBoundingClientRect && canvasRef?.current?.getBoundingClientRect()?.width) / 2 || 500;
    let level = 0;

    const getCenteringAdjustment = (lvl) => {
        return halfAreaWidth + xSpacing * 1.5 - (xSpacing * Math.pow(2, lvl)) / 1.3333;
    };

    const onClickAddNumber = () => {
        const newNumber = getRandomInt(0, heap.length);
        const newHeap = [...heap, newNumber];
        const i = newHeap.length - 1;
        setHeap(newHeap);
        setIndicesToSwapUp([...indicesToSwapUp, i]);
    };

    return (
        <div className={classes.root} ref={canvasRef}>
            <h3>Heap</h3>
            <button onClick={onClickAddNumber}>Add Number</button>
            <div className={classes.arrayContainer}>
                {heap.map((item, i) => (
                    <div className={classes.arrayItem} key={i}>
                        <div className={classes.arrayItemIndex}>{i}</div>
                        <div className={classes.arrayItemInner}>{item}</div>
                    </div>
                ))}
            </div>
            <svg width="100%" height="100%">
                <g>
                    {heap.map((n, i) => {
                        if (isPowerOfTwo(i + 1)) {
                            ++level;
                        }

                        const lChild = getLChildIndex(i);
                        const rChild = getRChildIndex(i);
                        const x = i * xSpacing + getCenteringAdjustment(level);
                        const nextLevelAdjustment = getCenteringAdjustment(level + 1);
                        const y = level * ySpacing;
                        return (
                            <g key={i}>
                                {heap[lChild] !== undefined && (
                                    <line
                                        stroke="#444"
                                        x1={x}
                                        y1={y}
                                        x2={lChild * xSpacing + nextLevelAdjustment}
                                        y2={(level + 1) * ySpacing}
                                    />
                                )}
                                {heap[rChild] !== undefined && (
                                    <line
                                        stroke="#444"
                                        x1={x}
                                        y1={y}
                                        x2={rChild * xSpacing + nextLevelAdjustment}
                                        y2={(level + 1) * ySpacing}
                                    />
                                )}
                                <circle
                                    stroke={"#444"}
                                    fill={indicesToSwapUp.includes(i) ? "yellow" : "white"}
                                    r="16"
                                    cx={x}
                                    cy={y}
                                ></circle>
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
