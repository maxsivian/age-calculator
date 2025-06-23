import React from 'react'
import styles from "./Circle.module.css"
//use memo

const WORLD_LIFE_EXPENTENCY = 73.4;

const Circle = ({ value=0 }) => {
    const percent = Math.min((value / WORLD_LIFE_EXPENTENCY) * 100, 100);
    const percentValue = (value / WORLD_LIFE_EXPENTENCY) * 100

    const radius = 18;
    const stroke = 2;
    const normalizedRadius = radius - stroke;
    const circumference = 2 * Math.PI * normalizedRadius;
    const strokeDashoffset =
        circumference - (percent / 100) * circumference;

    // const difference = WORLD_LIFE_EXPENTENCY - value
    // const strokeColor = value >= WORLD_LIFE_EXPENTENCY ?  "green" : "blue"
    // const charsLeftClass = difference < 0 ? "green" : "blue"

    // console.log('charsLeft', charsLeft);
    // console.log('charsLeftClass', charsLeftClass);

    return (
        <div className={styles.circle}>
            <svg
                width="100%"
                height="100%"
                viewBox={`0 0 ${radius * 2} ${radius * 2}`}
                className={styles.circleSvg}>
                <g transform={`rotate(-90, ${radius}, ${radius})`}>
                    <circle
                        // stroke="gray"
                        stroke="rgba(128, 128, 128, 0.5)"
                        fill="transparent"
                        strokeWidth={stroke}
                        r={normalizedRadius}
                        cx={radius}
                        cy={radius}
                    />
                    <circle 
                        // stroke={strokeColor}
                        // stroke={"var(--color1)"}
                        stroke="var(--color1)"
                        fill="transparent"
                        strokeWidth={stroke}
                        strokeDasharray={circumference + " " + circumference}
                        strokeDashoffset={strokeDashoffset.toString()}
                        r={normalizedRadius}
                        cx={radius}
                        cy={radius}
                        style={{ transition: "stroke-dashoffset 0.35s" }}
                    />
                </g> 
            </svg> 
            {/* <div className={`${styles.textLeft} ${styles[charsLeftClass]}`}>{percentValue.toFixed(1)}%</div> */}
            <div className={styles.textLeft}>{percentValue.toFixed(1)}%</div>

        </div>
    )
}

export default Circle