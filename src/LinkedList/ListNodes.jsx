/* eslint-disable react/prop-types */
import { createUseStyles } from "react-jss";

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

const ListNodes = ({ node, i = 0, backgroundColor }) => {
    const classes = nodeStyles();
    if (!node) {
        return null;
    }
    return (
        <>
            <div className={classes.node} key={i} style={{ backgroundColor: backgroundColor && backgroundColor(node.val) }}>
                {node.val}
            </div>
            {node.next && <ListNodes node={node.next} key={i + 1} backgroundColor={backgroundColor} />}
        </>
    );
};

export default ListNodes;
