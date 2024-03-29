import { useEffect, useState } from "react";
import { getRandomInt } from "../utils";
import { createUseStyles } from "react-jss";

const useStyles = createUseStyles({
    floorNumber: {
        width: "40px",
        height: "100%",
        textAlign: "center",
        borderRight: "1px solid rgba(0, 0, 0, 0.5)",
        display: "inline-block",
        verticalAlign: "top",
        fontWeight: "bold",
        boxSizing: "content-box",
        fontSize: "2rem",
    },
    floor: {
        height: "50px",
        display: "flex",
        borderBottom: "1px solid rgba(0, 0, 0, 0.5)",
    },
    elevator: {
        height: "100%",
        minWidth: "100px",
        backgroundColor: "rgb(220, 240, 255)",
        display: "flex",
        paddingLeft: 8,
    },
    elevatorSpacer: {
        minWidth: "100px",
        paddingLeft: 8,
    },
    passenger: {
        display: "inline-block",
        width: "8px",
        margin: 4,
        padding: 4,
        height: "20px",
        textAlign: "center",
        border: "1px solid rgba(0, 0, 0, 0.2)",
        borderRadius: "30px",
        verticalAlign: "top",
    },
    container: {
        display: "flex",
        flexDirection: "column-reverse",
        width: "80rem",
    },
});

const NUM_FLOORS = 10;

// A person is represented by the floor number (integer) they want to get to
const createPerson = (originalFloor) => {
    const getRandomFloor = () => getRandomInt(0, NUM_FLOORS - 1);
    let floor = getRandomFloor();
    while (floor === originalFloor) {
        // Quick n dirty, person must always want to go to another floor
        floor = getRandomFloor();
    }
    return floor;
};

const Elevator = () => {
    const [floors, setFloors] = useState(Array.from({ length: NUM_FLOORS }).map(() => []));

    const [currentElevatorFloor, setCurrentElevatorFloor] = useState(0); // Elevator current floor
    const [passengers, setPassengers] = useState([]); // People onboard the elevator
    const [serviceQueue, setServiceQueue] = useState([]); // The order in which people pressed the up or down button. { floor: number, direction: 1 (going up), -1 (going down) }

    const classes = useStyles();

    useEffect(() => {
        /**
         * Tricky: States are soft copied here to be mutated by the two setIntervals.
         * This is to a) ensure states are always up to date for each interval b) enable an empty dependency array so that the intervals don't interrupt each other when updating state.
         */
        let floorsCopy = floors.slice();
        let queue = serviceQueue.slice();
        let currentFloor = currentElevatorFloor;
        let updatedPassengers = passengers.slice();

        const moveElevator = (direction) => {
            const newFloor = currentFloor + direction;
            if (newFloor > -1 && newFloor < floors.length) {
                currentFloor = newFloor;
                setCurrentElevatorFloor(currentFloor);
            }
        };

        const incrementElevator = setInterval(() => {
            // Passengers who have reached their destination disembark
            updatedPassengers = updatedPassengers.filter((p) => p !== currentFloor);
            setPassengers(updatedPassengers);

            if (queue.length === 0 && updatedPassengers.length === 0) {
                if (currentFloor > 0) {
                    moveElevator(-1);
                }

                return;
            }

            if (updatedPassengers.length === 0) {
                const { floor, direction } = queue[0];

                // Go to where our first passenger will be
                let farthestRequestInDirection = queue[0];

                for (const request of queue) {
                    const isFartherAwayInDirection = direction === -1 ? floor < request.floor : request.floor > floor;
                    if (direction === request.direction && isFartherAwayInDirection) {
                        farthestRequestInDirection = request;
                    }
                }

                if (currentFloor !== farthestRequestInDirection.floor) {
                    moveElevator(currentFloor > farthestRequestInDirection.floor ? -1 : 1);
                    return;
                }
            } else {
                // Move the elevator in the direction that the passengers need
                moveElevator(updatedPassengers[0] < currentFloor ? -1 : 1);
            }

            let direction;
            if (updatedPassengers.length) {
                direction = updatedPassengers[0] < currentFloor ? -1 : 1;
            } else if (queue.length) {
                direction = queue[0].direction;
            }

            const shouldGetOnElevator = (passengerDestination) => {
                const passengerTravelingDirection = passengerDestination > currentFloor ? 1 : -1;
                return passengerTravelingDirection === direction || updatedPassengers.length === 0;
            };

            floorsCopy[currentFloor] = floorsCopy[currentFloor].filter((p) => {
                if (shouldGetOnElevator(p)) {
                    updatedPassengers.push(p);
                    return false;
                }

                return true;
            });

            setFloors(floorsCopy.slice());
            setPassengers(updatedPassengers);

            // Check if the service queue (button presses) have been serviced by the elevator arriving at this floor
            queue = queue.filter(({ floor, direction: d }) => {
                const isServiced = floor === currentFloor && d === direction;
                return !isServiced;
            });
            setServiceQueue(queue);
        }, 500);

        const spawnPerson = setInterval(() => {
            const floor = getRandomInt(0, NUM_FLOORS - 1);
            // A person is represented by the floor number (integer) they want to get to
            const destinationFloor = createPerson(floor);
            floorsCopy[floor].push(destinationFloor);
            setFloors(floorsCopy.slice());
            queue = [...queue, { floor, direction: destinationFloor > floor ? 1 : -1 }];
            setServiceQueue(queue);
        }, 2500);

        return () => {
            clearInterval(incrementElevator);
            clearInterval(spawnPerson);
        };
    }, []);

    let direction;
    if (passengers.length) {
        if (passengers.some((p) => p !== currentElevatorFloor)) {
            direction = passengers.some((p) => p < currentElevatorFloor) ? -1 : 1;
        }
    } else if (serviceQueue.length) {
        direction = serviceQueue[0].direction;
    }

    const getFloorBG = (floor) => {
        if (currentElevatorFloor === floor) {
            if (passengers.some((p) => p === floor)) {
                return "rgb(200, 255, 200)";
            }
            return "rgb(220, 240, 255)";
        }
    };

    return (
        <div className={classes.container}>
            {direction && <div>Going {direction === -1 ? "down" : "up"}</div>}

            {floors.slice().map((_, i) => (
                <div key={i} className={classes.floor}>
                    <span
                        className={classes.floorNumber}
                        style={{
                            backgroundColor: getFloorBG(i),
                        }}
                    >
                        {i === 0 ? "G" : i}
                    </span>
                    {i === currentElevatorFloor && (
                        <div className={classes.elevator}>
                            {passengers.map((p, j) => (
                                <span
                                    className={classes.passenger}
                                    key={j}
                                    style={{
                                        backgroundColor: getFloorBG(p),
                                    }}
                                >
                                    {p === 0 ? "G" : p}
                                </span>
                            ))}
                        </div>
                    )}
                    {i !== currentElevatorFloor && <div className={classes.elevatorSpacer} />}
                    <div>
                        {floors[i].map((p, j) => (
                            <span className={classes.passenger} key={j}>
                                {p === 0 ? "G" : p}
                            </span>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default Elevator;
