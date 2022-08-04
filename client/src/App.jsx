import React, { useEffect, useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import Context from './Context';
import axios from 'axios';

import HomePage from './components/HomePage';
import Login from './components/Login';
import Register from './components/Register';

import './App.scss';
import './styles/bootstrap-social.css';

function App() {
	const [user, setUser] = useState();

	useEffect(() => {
		axios('http://localhost:3000/api/user')
			.then((data) => {
				setUser(data.data.user);
				console.log(data.data.user);
			})
			.catch((err) => console.log(err));
	}, []);

	return (
		<div className="App">
			<Context.Provider value={{ user }}>
				<Routes>
					<Route path="/" element={<HomePage />} />
					<Route path="/login" element={<Login />} />
					<Route path="/register" element={<Register />} />
				</Routes>
			</Context.Provider>
		</div>
	);
}

export default App;
