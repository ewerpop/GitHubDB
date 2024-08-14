import styles from "./App.module.scss"
import HeaderForm from "./HeaderForm"
import MainContent from "./MainContent"
import { useState } from "react"
import WelcomePage from "./WelcomePage"

const App = () => {
  const [search, setSearch] = useState<boolean>(false)
  function handleSubmit() {
    setSearch(true)
  }

  return (
    <>
      <div className={styles.afterRootDiv}>
        <HeaderForm handleSubmit={handleSubmit}/>
        {search ? <MainContent/> : <WelcomePage />}
        <footer className={styles.mainFooter}></footer>
      </div>
    </>
  )
}

export default App
