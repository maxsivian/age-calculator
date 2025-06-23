"use client"
import styles from "./Settings.module.css"
import SettingsSVG from "./svg_components/SettingsSVG"
import CloseSVG from "./svg_components/CloseSVG"
import { useEffect, useState } from "react"

import { useDispatch } from "react-redux"
import { reset } from "../redux/coreSlice"

const defaultColor1 = "#00ffff";
const defaultColor2 = "#006464";
const defaultColor3 = "#ffffff";
const defaultColor4 = "#00ffff";



const Settings = ({ onReady }) => {
    const dispatch = useDispatch()

    const [isPopUpActive, setIsPopUpActive] = useState(false)
    const [openAnim, setOpenAnim] = useState(false)

    const [color1, setColor1] = useState(""); //get css var --color1
    const [color2, setColor2] = useState("")
    const [color3, setColor3] = useState("")
    const [color4, setColor4] = useState("")



    useEffect(() => {
        document.documentElement.style.setProperty('--color1', color1);
    }, [color1])

    useEffect(() => {
        document.documentElement.style.setProperty('--color2', color2);
    }, [color2])

    useEffect(() => {
        document.documentElement.style.setProperty('--color3', color3);
    }, [color3])

    useEffect(() => {
        document.documentElement.style.setProperty('--color4', color4);
    }, [color4])

    useEffect(() => {

        const root = getComputedStyle(document.documentElement);

        try {
            setColor1(localStorage.getItem("color1") || defaultColor1)
            setColor2(localStorage.getItem("color2") || defaultColor2)
            setColor3(localStorage.getItem("color3") || defaultColor3)
            setColor4(localStorage.getItem("color4") || defaultColor4)

        } catch (error) {
            setColor1(root.getPropertyValue('--color1').trim());
            setColor2(root.getPropertyValue('--color2').trim());
            setColor3(root.getPropertyValue('--color3').trim());
            setColor3(root.getPropertyValue('--color4').trim());
        } finally {
            onReady()
        }


    }, []);


    const handleClick = () => {
        // setIsPopUpActive(!isPopUpActive)
        if (isPopUpActive) {
            setOpenAnim(false)
            setTimeout(() => {
                setIsPopUpActive(false)
            }, 500);
        }
        else {
            setIsPopUpActive(true)
            setTimeout(() => {
                setOpenAnim(true)
            }, 10);
        }
    }

    const handleOverlayClick = (e) => {
        if (e.target.classList.contains(styles.overlay)) {
            setOpenAnim(false)
            setTimeout(() => {
                setIsPopUpActive(false)
            }, 500);
        }
    }

    const handleColorChange = (e) => {
        if (e.target.name == "color1") {
            setColor1(e.target.value)
        }
        else if (e.target.name == "color2") {
            setColor2(e.target.value)
        }
        else if (e.target.name == "color3") {
            setColor3(e.target.value)
        }
        else if (e.target.name == "color4") {
            setColor4(e.target.value)
        }

        localStorage.setItem(e.target.name, e.target.value)
    }

    const handleResetColor = (e) => {
        // Set CSS variables
        document.documentElement.style.setProperty('--color1', defaultColor1);
        document.documentElement.style.setProperty('--color2', defaultColor2);
        document.documentElement.style.setProperty('--color3', defaultColor3);
        document.documentElement.style.setProperty('--color4', defaultColor4);

        // Update localStorage
        localStorage.setItem("color1", defaultColor1);
        localStorage.setItem("color2", defaultColor2);
        localStorage.setItem("color3", defaultColor3);
        localStorage.setItem("color4", defaultColor4);


        // Update state directly
        setColor1(defaultColor1);
        setColor2(defaultColor2);
        setColor3(defaultColor3);
        setColor4(defaultColor4);
    };

    const handleResetData = () => {
        dispatch(reset())
    }

    return (
        <>
            <button className={styles.container} onClick={handleClick}>
                <SettingsSVG />
            </button>
            {
                isPopUpActive && (
                    <div className={styles.overlay} onClick={handleOverlayClick}>
                        <div className={`${styles.settingsC} ${openAnim ? styles.anim : ""}`}>
                            <button onClick={handleClick} className={styles.closeButton}>
                                <CloseSVG />
                            </button>
                            <div>
                                <div>Color 1</div>
                                <input type="color" value={color1} onChange={handleColorChange} name="color1" />
                            </div>
                            <div>
                                <div>Color 2</div>
                                <input type="color" value={color2} onChange={handleColorChange} name="color2" />
                            </div>
                            <div>
                                <div>Color 3</div>
                                <input type="color" value={color3} onChange={handleColorChange} name="color3" />
                            </div>
                            <div>
                                <div>Color 4</div>
                                <input type="color" value={color4} onChange={handleColorChange} name="color4" />
                            </div>
                            <div>
                                <button onClick={handleResetColor} className={styles.resetColorButton}>Reset colors</button>
                            </div>
                            <div>
                                <button onClick={handleResetData} className={styles.resetColorButton}>Reset data</button>
                            </div>
                        </div>
                    </div>
                )
            }
        </>
    )
}

export default Settings