import { createUseStyles } from "react-jss";
import Heap from "./Heap";

const useStyles = createUseStyles({
    root: {
        width: "100%",
        height: "100%",
        fontFamily: "barlow, sans-serif",
    },
    center: {
        margin: "2rem auto",
        width: "80rem",
    },
});

const App = () => {
    const classes = useStyles();
    return (
        <div className={classes.root}>
            <div className={classes.center}>
                <h1>Not Interesting</h1>
                <h3>A collection of things that are not interesting.</h3>
                <hr />
                <Heap />
            </div>
        </div>
    );
};

export default App;
