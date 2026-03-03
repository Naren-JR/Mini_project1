import { Routes, Route } from "react-router-dom";

import Home from './pages/Home'
import Visit from './pages/Visit'
import Navbar from './components/Navbar'
import NxtRace from './components/NxtRace'

import './App.css'

function App() {

	return (
		<>
			<Navbar />

			<Routes>
				<Route path="/" element={<Home />} />
				<Route path="/Visit" element={<Visit />} />
			</Routes>
		</>
	)
}

export default App
