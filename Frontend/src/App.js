
import { Outlet } from 'react-router'
import Header from './components/Header'
import Footer from './components/Footer'

const App = () => {
    return (
        <div>
            <div className="min-h-screen flex flex-col">
                <Header />
                <main className="flex-grow">
                    <Outlet />
                </main>
                <Footer />
            </div>
        </div>
    )
}

export default App
