"use client"
import styles from "./Input.module.css"
import { useSelector, useDispatch } from 'react-redux'
import { setValue } from '../redux/coreSlice'
import { useEffect, useState } from "react"
import { setDatetime } from "../redux/coreSlice"

const Input = () => {
  const dispatch = useDispatch()
  const [localValue, setLocalValue] = useState("2000-01-01T00:00")
  
  const handleChange = (e)=>{
    setLocalValue(e.target.value)
  }

  const handleSetValue = ()=>{
    dispatch(setValue(localValue))
    dispatch(setDatetime(new Date().toLocaleString('en-GB', { day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false })));

  }

  return (
    <div className={styles.container}>
      {/* {localValue} */}
      <input type="datetime-local" name="" id="" value={localValue} onChange={handleChange} className={styles.input}/>
      <button onClick={handleSetValue} className={styles.button}>Calculate Age</button>
    </div>
  )
}

export default Input