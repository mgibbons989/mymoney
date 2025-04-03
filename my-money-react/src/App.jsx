import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import "./styles.css";

import Header from "./components/header";
import Footer from "./components/footer";

function App() {

  return (
    <>
      <Header />
      <div className='temp-main'>hey</div>
      <Footer />
    </>
  )
}

export default App
