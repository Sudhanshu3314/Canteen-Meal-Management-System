
import { Outlet } from 'react-router'
import Header from './components/Header'
import Body from './components/Body'

const App = () => {
    return (
        <div>
            <Header />
            <Outlet />
        </div>
    )
}

export default App
