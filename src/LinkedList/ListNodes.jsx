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

const ListNodes = ({ node, i = 0, backgroundColor, getHighlight, endAfter }) => {
    const classes = nodeStyles();
    if (!node || i >= endAfter) {
        return null;
    }

    const bg = (backgroundColor && backgroundColor(node.val)) || (getHighlight && getHighlight(node));

    return (
        <>
            <div className={classes.node} key={i} style={{ backgroundColor: bg }}>
                {node.val}
            </div>
            {node.next && (
                <ListNodes node={node.next} i={i + 1} backgroundColor={backgroundColor} getHighlight={getHighlight} endAfter={endAfter} />
            )}
        </>
    );
};

export default ListNodes;
