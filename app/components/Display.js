"use client"

import { useEffect, useRef, useState } from "react"
import { memo } from "react"
import styles from "./Display.module.css"
import { useSelector } from "react-redux"
import { useCallback } from "react"

import html2canvas from 'html2canvas'
import Circle from "./Circle"
import DownloadSVG from "./svg_components/DownloadSVG"
import DateTime from "./DateTime"


let name
let currentDate

let total_seconds
let total_minutes
let total_hours
let total_days
let total_weeks
let years_diff
let total_months
let total_years

let years
let months
let days
let normalized_year

const Display = () => {

  const value = useSelector((state) => state.core.value)
  const name = useSelector((state) => state.core.name)

  const intervalRef = useRef(null)
  const [data, setData] = useState({ total_seconds: 0, total_minutes: 0, total_hours: 0, total_days: 0, total_weeks: 0, years_diff: 0, total_months: 0, total_years: 0, years: 0, months: 0, days: 0, normalized_year: 0 })
  // const [visibility, setVisibility] = useState(false)

  useEffect(() => {
    if (value) {
      let birthDate = new Date(value)

      intervalRef.current = setInterval(() => {
        currentDate = new Date()

        total_seconds = Math.floor((currentDate.getTime() - birthDate.getTime()) / 1000)
        total_minutes = Math.floor(total_seconds / 60)
        total_hours = Math.floor(total_minutes / 60)
        total_days = Math.floor(total_hours / 24)
        total_weeks = Math.floor(total_days / 7)

        years_diff = currentDate.getFullYear() - birthDate.getFullYear()
        total_months = years_diff * 12 + (currentDate.getMonth() - birthDate.getMonth())
        total_years = Math.floor(total_months / 12)

        years = total_years
        months = Math.floor((total_days % 365) / 30)
        days = (total_days % 365) % 30

        normalized_year = (total_seconds / (60 * 60 * 24 * 365)).toFixed(9)

        // console.log(total_seconds);
        setData({
          ...data,
          total_seconds, total_minutes, total_hours, total_days, total_weeks, years_diff, total_months, total_years, years, months, days, normalized_year
        })

      }, 1000);
    }
    else{
      setData({ total_seconds: 0, total_minutes: 0, total_hours: 0, total_days: 0, total_weeks: 0, years_diff: 0, total_months: 0, total_years: 0, years: 0, months: 0, days: 0, normalized_year: 0 })
    }

    return () => {
      clearInterval(intervalRef.current)
    }
  }, [value])


  const downloadDiv = useCallback(() => {
    const div = document.getElementById('targetDiv');
    if (!div) return;

    html2canvas(div, { backgroundColor: null }).then((canvas) => {
      const link = document.createElement('a');
      link.download = `age.png`;
      link.href = canvas.toDataURL();
      link.click();
    });

  }, [name]);


  return (
    <>
      <div className={styles.display} id="targetDiv">
        <div className={styles.first} contentEditable spellCheck={false} autoFocus tabIndex={1} suppressContentEditableWarning>
          {/* {name == "" ? "Your Name" : name} */}
          Your Name
        </div>
        <div className={styles.second}>
          <div className={styles.itemC}>
            <div className={styles.label}>Years</div>
            <div className={styles.data}>{data.years}</div>
          </div>
          <div className={styles.itemC}>
            <div className={styles.label}>Months</div>
            <div className={styles.data}>{data.months}</div>
          </div>
          <div className={styles.itemC}>
            <div className={styles.label}>Days</div>
            <div className={styles.data}>{data.days}</div>
          </div>
        </div>
        <div className={styles.third}>
          <div className={styles.itemC}>
            <div className={styles.label}>Total Years:</div>
            <div className={styles.data}>{data.total_years.toLocaleString("en-US")}</div>
          </div>
          <div className={styles.itemC}>
            <div className={styles.label}>Total Months:</div>
            <div className={styles.data}>{data.total_months.toLocaleString("en-US")}</div>
          </div>
          <div className={styles.itemC}>
            <div className={styles.label}>Total Weeks:</div>
            <div className={styles.data}>{data.total_weeks.toLocaleString("en-US")}</div>
          </div>
          <div className={styles.itemC}>
            <div className={styles.label}>Total Days:</div>
            <div className={styles.data}>{data.total_days.toLocaleString("en-US")}</div>
          </div>
          <div className={styles.itemC}>
            <div className={styles.label}>Total Hours:</div>
            <div className={styles.data}>{data.total_hours.toLocaleString("en-US")}</div>
          </div>
          <div className={styles.itemC}>
            <div className={styles.label}>Total Minutes:</div>
            <div className={styles.data}>{data.total_minutes.toLocaleString("en-US")}</div>
          </div>
          <div className={styles.itemC}>
            <div className={styles.label}>Total Seconds:</div>
            <div className={styles.data}>{data.total_seconds.toLocaleString("en-US")}</div>
          </div>
        </div>
        <div className={styles.fourth}>
          <div>
            <div className={styles.label}>
              World Life Expectency
            </div>
            <div className={styles.label}>
              (73.4 Years)
            </div>
          </div>
          <Circle value={data.normalized_year} />
          {/* <Circle value={80}/> */}
        </div>
        <div className={styles.fifth}>
          <div>
            {data.normalized_year.toLocaleString("en-US")} YEARS
          </div>
        </div>

        <div className={styles.sixth}>
          <DateTime />
        </div>

      </div>

      <button onClick={downloadDiv} className={styles.downloadButton}>
        <span className={styles.label}>
          Download&nbsp;Card
        </span>
        <DownloadSVG />
      </button>
    </>
  )
}

export default memo(Display)