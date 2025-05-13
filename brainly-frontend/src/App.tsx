import './App.css'
import { Dashboard } from './Dashboard'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Signin } from './Signin'
import { Signup } from './Signup'


function App() {

  return (
    <>
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<Signup/>}/>
      <Route path="/signin" element={<Signin/>}/>
      <Route path="/login" element={<Signin></Signin>}/>
      <Route path = "/dashboard" element={<Dashboard/>}/>
    </Routes>
    </BrowserRouter>
    </>
  )
}

export default App
