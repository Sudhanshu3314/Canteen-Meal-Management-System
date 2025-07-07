import React from 'react'
import LoginUser from './components/Login/Login'
import RegisterUser from './components/Register/Register'
import { Outlet } from 'react-router'

const App = () => {
    return (
        <div>
            <Outlet/>
        </div>
    )
}

export default App
