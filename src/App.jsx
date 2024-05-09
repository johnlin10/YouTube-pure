import { Routes, Route } from 'react-router'
import './App.scss'
import style from './App.module.scss'

import Player from './pages/Player/Player'
import TermsOfUse from './pages/TermsOfUse/TermsOfUse'

function App() {
  return (
    <div className={style.app}>
      <main>
        <Routes>
          <Route path="/" element={<Player />} />
          <Route path="/" element={<TermsOfUse />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
