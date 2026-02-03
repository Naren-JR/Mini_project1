import { Routes, Route } from "react-router-dom";

import Home from './pages/Home'
import Navbar from './components/Navbar'
import NxtRace from './components/NxtRace'

import './App.css'

function App() {

	return (
		<>
			<Navbar />
			<NxtRace />
			<Routes>
				<Route path="/" element={<Home />} />
			</Routes>
		</>
	)
}

export default App
