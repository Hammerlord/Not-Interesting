import { cloneDeep } from "lodash";
import { useEffect, useState } from "react";

const SIZE = 10;
const defaultMatrix = Array.from({ length: SIZE }).map(() => Array.from({ length: SIZE }).map(() => null));
const defaultPos = { x: 0, y: 0, dirX: 1, dirY: 0 };

const SquareMatrix = () => {
    const [matrix, setMatrix] = useState(defaultMatrix);
    const [pos, setPos] = useState(defaultPos);

    useEffect(() => {
        let { x, y, dirX, dirY } = pos;

        const interval = setInterval(() => {
            const newMatrix = cloneDeep(matrix);
            const next = newMatrix[x + dirX]?.[y + dirY];
            if ([undefined, true].includes(next)) {
                // Ran into a boundary or wall, find a new direction
                if (newMatrix[x + 1]?.[y] === null) {
                    dirX = 1;
                    dirY = 0;
                } else if (newMatrix[x]?.[y + 1] === null) {
                    dirX = 0;
                    dirY = 1;
                } else if (newMatrix[x - 1]?.[y] === null) {
                    dirX = -1;
                    dirY = 0;
                } else {
                    dirX = 0;
                    dirY = -1;
                }
            }

            newMatrix[x][y] = true;
            setMatrix([...newMatrix]);
            setPos({
                x: x + dirX,
                y: y + dirY,
                dirX,
                dirY,
            });
        }, 50);

        return () => clearInterval(interval);
    }, [matrix]);

    const reset = () => {
        setMatrix(defaultMatrix);
        setPos(defaultPos);
    };

    return (
        <div>
            {matrix.map((row, i) => (
                <div key={`row-${i}`}>
                    {row.map((col, i) => (
                        <div
                            key={`col-${i}`}
                            style={{ width: "30px", height: "30px", display: "inline-block", backgroundColor: (col && "#000") || "#fff" }}
                        />
                    ))}
                </div>
            ))}
            <br />
            <button onClick={reset}>Reset</button>
        </div>
    );
};

export default SquareMatrix;
