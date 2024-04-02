import React from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Home from './components/Home'
import Models from './components/Models'
import ModelDetails from './components/ModelDetails'

import './App.css'

function App() {
  return(
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/models' element={<Models />} />
      <Route path='/models/:modelName' element={<ModelDetails />} />
    </Routes>
  );
}

export default App
