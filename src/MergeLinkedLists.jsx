import { useEffect, useState } from "react";
import { createUseStyles } from "react-jss";

export const getRandomInt = (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

const createSortedNumbers = (minSize, maxSize) => {
    return Array.from({ length: getRandomInt(minSize, maxSize) })
        .map(() => getRandomInt(0, maxSize))
        .sort((a, b) => a - b);
};

const createSortedLinkedList = (minSize, maxSize) => {
    const arr = createSortedNumbers(minSize, maxSize);
    let root = null;
    let current = null;
    while (arr.length) {
        const arrVal = arr.shift();
        if (!root) {
            root = { value: arrVal, next: current };
            current = root;
        } else {
            current.next = { value: arrVal, next: null };
            current = current.next;
        }
    }

    return root;
};

const linkedListToArr = (linkedList) => {
    const arr = [];
    while (typeof linkedList?.value === "number") {
        arr.push(linkedList.value);
        linkedList = linkedList.next;
    }
    return arr;
};

const findLowestIndex = (linkedLists) => {
    let index = null;
    let lowest = Infinity;
    linkedLists.forEach((list, i) => {
        if (list?.value < lowest) {
            index = i;
            lowest = list.value;
        }
    });

    return index;
};

const useStyles = createUseStyles({
    root: {
        width: "80rem",
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
    },
    list: {
        minHeight: "65px",
        margin: "20px 0",
        paddingLeft: "15px",
        borderLeft: "2px solid #ccc",
    },
    inputContainer: {
        margin: "0 2rem",
    },
    input: {
        width: "50px",
        padding: "0.25rem",
        marginLeft: "0.2rem",
        border: 0,
        borderBottom: "2px solid #ccc",
    },
    merged: {
        marginTop: "3rem",
        textAlign: "center",
    },
});

const MAX_LIST_SIZE = 100;
const MAX_NUM_LISTS = 100;

const MergeLinkedLists = () => {
    const [numLists, setNumLists] = useState(5);
    const [listMinSize, setListMinSize] = useState(15);
    const [listMaxSize, setListMaxSize] = useState(15);
    const [playbackSpeed, setPlaybackSpeed] = useState(50);
    const [linkedLists, setLinkedLists] = useState(
        Array.from({ length: numLists }).map(() => createSortedLinkedList(listMinSize, listMaxSize))
    );
    const [merged, setMerged] = useState(null);
    const [mergedCurrent, setMergedCurrent] = useState(null);
    const classes = useStyles();

    useEffect(() => {
        const interval = setInterval(() => {
            const lowestIndex = findLowestIndex(linkedLists);
            if (lowestIndex === null) {
                clearInterval(interval);
                return;
            }

            const node = linkedLists[lowestIndex];
            const newLinkedLists = [...linkedLists];
            newLinkedLists[lowestIndex] = node.next;
            setLinkedLists(newLinkedLists);

            const nodeToAdd = { value: node.value, next: null };
            if (!merged) {
                setMerged(nodeToAdd);
                setMergedCurrent(nodeToAdd);
            } else {
                mergedCurrent.next = nodeToAdd;
                setMergedCurrent(nodeToAdd);
            }
        }, 15000 / playbackSpeed);

        return () => clearInterval(interval);
    }, [merged, mergedCurrent, playbackSpeed]);

    const onChangeMaxSize = (e) => {
        const val = e.target.value;
        if (val < listMinSize) {
            setListMaxSize(listMinSize);
        } else if (val > MAX_LIST_SIZE) {
            setListMaxSize(MAX_LIST_SIZE);
        } else {
            setListMaxSize(val);
        }
    };

    const getColor = (value) => {
        const additionVal = Number(value);
        return `rgb(${220 - additionVal}, ${250 - additionVal}, ${255 - additionVal * 4})`;
    };

    const onChangeMinSize = (e) => {
        const val = e.target.value;
        if (val > listMaxSize) {
            setListMinSize(listMaxSize);
        } else if (val > MAX_LIST_SIZE) {
            setListMinSize(MAX_LIST_SIZE);
        } else {
            setListMinSize(val);
        }
    };

    const onChangeNumberOfLists = (e) => {
        const val = e.target.value;
        if (val < 0) {
            setNumLists(0);
        } else if (val > MAX_NUM_LISTS) {
            setNumLists(MAX_NUM_LISTS);
        } else {
            setNumLists(val);
        }
    };

    const onChangeSpeed = (e) => {
        const val = e.target.value;
        if (val < 1) {
            setPlaybackSpeed(1);
        } else if (val > 100) {
            setPlaybackSpeed(100);
        } else {
            setPlaybackSpeed(val);
        }
    };

    const onReset = () => {
        setLinkedLists(Array.from({ length: numLists }).map(() => createSortedLinkedList(listMinSize, listMaxSize)));
        setMerged(null);
        setMergedCurrent(null);
    };

    return (
        <div className={classes.root}>
            <h4>Merge Sorted Linked Lists</h4>
            <label className={classes.inputContainer}>
                Number of Lists{" "}
                <input type="number" max={MAX_NUM_LISTS} className={classes.input} value={numLists} onInput={onChangeNumberOfLists} />
            </label>{" "}
            <label className={classes.inputContainer}>
                Min Size{" "}
                <input type="number" min={0} max={listMaxSize} className={classes.input} value={listMinSize} onInput={onChangeMinSize} />
            </label>
            <label className={classes.inputContainer}>
                Max Size{" "}
                <input
                    type="number"
                    min={listMinSize}
                    max={MAX_LIST_SIZE}
                    className={classes.input}
                    value={listMaxSize}
                    onInput={onChangeMaxSize}
                />
            </label>
            <button onClick={onReset}>Reset</button>
            <label className={classes.inputContainer}>
                Playback Speed <input type="number" max={100} className={classes.input} value={playbackSpeed} onInput={onChangeSpeed} />
            </label>
            {linkedLists.map((list, i) => (
                <div key={i} className={classes.list}>
                    {linkedListToArr(list).map((val, i) => (
                        <div key={i} className={classes.node} style={{ backgroundColor: getColor(val) }}>
                            {val}
                        </div>
                    ))}
                </div>
            ))}
            <div className={classes.merged}>Merged</div>
            <div className={classes.list}>
                {linkedListToArr(merged).map((val, i) => (
                    <div key={i} className={classes.node} style={{ backgroundColor: getColor(val) }}>
                        {val}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MergeLinkedLists;
