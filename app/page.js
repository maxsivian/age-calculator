"use client"
import styles from "./page.module.css";
import Input from "./components/Input";
import Display from "./components/Display";
import Settings from "./components/Settings";
import { useState } from "react";

export default function Home() {

  const [isSettingsReady, setIsSettingsReady] = useState(false)

  return (
    <div className={styles.container}>
      <Settings onReady={() => setIsSettingsReady(true)} />
      {
        isSettingsReady && (
          <>
            <Input />
            <Display />
          </>
        )
      }
    </div>
  );
}
