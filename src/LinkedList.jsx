/* eslint-disable react/prop-types */
import { useState } from "react";
import { getRandomInt } from "./utils";
import { createUseStyles } from "react-jss";

const createLinkedList = (length = 15) => {
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

const LinkedListExample = () => {
    const [list, setList] = useState(createLinkedList(16));
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

    return (
        <div>
            <div className={classes.center}>
                <button onClick={onClickReverse}>Reverse</button>
            </div>
            <div className={classes.list}>
                <ListNodes node={list} i={0} />
            </div>
        </div>
    );
};

const nodeStyles = createUseStyles({
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
});

const ListNodes = ({ node, i }) => {
    const classes = nodeStyles();
    return (
        <>
            <div className={classes.node} key={i}>
                {node.val}
            </div>
            {node.next && <ListNodes node={node.next} key={i + 1} />}
        </>
    );
};

export default LinkedListExample;
