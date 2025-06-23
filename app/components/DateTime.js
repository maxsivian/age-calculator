"use client"
import { useSelector } from "react-redux"

const DateTime = () => {
    const datetime = useSelector((state) => state.core.datetime)

    if (!datetime) return null

    return (
        <div>
            <div>
                Created on {datetime}
            </div>
        </div>
    )
}

export default DateTime