import { useEffect, useState } from "react";
import { getRandomInt } from "../utils";
import { createUseStyles } from "react-jss";
import ListNodes from "./ListNodes";

const createLinkedList = ({ length = 15, isLooping = false }) => {
    let head = null;
    let current = head;

    Array.from({ length }).forEach((_, i) => {
        const val = getRandomInt(0, i + 1);
        if (!head) {
            head = { val, next: null };
            current = head;
        } else {
            current.next = { val, next: null };
            current = current.next;
        }
    });

    if (isLooping) {
        current.next = head;
    }

    return head;
};

const useStyles = createUseStyles({
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
    center: {
        textAlign: "center",
    },
});

const numItems = 15;

const LinkedListExample = () => {
    const [list, setList] = useState(createLinkedList({ length: numItems }));
    const [loopingList] = useState(createLinkedList({ length: numItems, isLooping: true }));
    const [loopI, setLoopI] = useState(loopingList);
    const [loopJ, setLoopJ] = useState(loopingList);

    useEffect(() => {
        const interval = setInterval(() => {
            setLoopI(loopI.next);
            setLoopJ(loopJ.next.next);
        }, 500);

        return () => clearInterval(interval);
    }, [loopI, loopJ]);

    const classes = useStyles();

    const onClickReverse = () => {
        // In place reverse; violates React but it's just for practice
        let current = list?.next;
        let prev = list;
        if (prev) prev.next = null;

        while (current) {
            let temp = current.next;
            current.next = prev;

            if (!temp) {
                setList(current);
                return;
            }
            prev = current;
            current = temp;
        }
    };

    const getHighlight = (node) => {
        if (node === loopI && node === loopJ) {
            return "lime";
        }

        if (node === loopI) {
            return "yellow";
        }

        if (node === loopJ) {
            return "#55ccee";
        }
    };

    return (
        <div>
            <h4>Just a Linked List</h4>
            <div className={classes.center}>
                <button onClick={onClickReverse}>Reverse</button>
            </div>
            <div className={classes.list}>
                <ListNodes node={list} i={0} />
            </div>
            <h4>Looping Linked List</h4>
            <div className={classes.list}>
                <ListNodes node={loopingList} i={0} getHighlight={getHighlight} endAfter={numItems} />
            </div>
        </div>
    );
};

export default LinkedListExample;
