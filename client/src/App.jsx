import React, { useEffect, useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import Context from './Context';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';

import HomePage from './components/HomePage/HomePage';
import Login from './components/Login/Login';
import Register from './components/Register';
import Secrets from './components/Secrets';
import Submit from './components/Submit';
import CbGoogle from './components/CbGoogle';

import './App.scss';
import './styles/bootstrap-social.css';
import 'react-toastify/dist/ReactToastify.css';

function App() {
	const [user, setUser] = useState();
	const [secrets, setSecrets] = useState([]);

	useEffect(() => {
		fetchData();
	}, []);

	const fetchData = () => {
		console.log('fetch /auth/login/success');
		axios('http://localhost:3000/auth/login/success')
			.then((res) => {
				if (res.status === 200) {
					setUser(res.data.success);
					console.log(res.data);
				} else throw new Error('authentication has been failed!');
			})
			.catch((err) => console.log(err));

		console.log('fetch /api/secrets');
		axios
			.post('http://localhost:3000/api/secrets')
			.then((res) => {
				if (res.status === 200) {
					setSecrets(res.data.secrets);
					console.log(res.data);
				} else throw new Error('authentication has been failed!');
			})
			.catch((err) => console.log(err));
	};

	return (
		<div className="App">
			<Context.Provider value={{ user, fetchData, secrets, toast }}>
				<Routes>
					<Route path="/" element={<HomePage />} />
					<Route path="/login" element={<Login />} />
					<Route path="/register" element={<Register />} />
					<Route path="/secrets" element={<Secrets />} />
					<Route path="/submit" element={<Submit />} />
					<Route path="/cb/google" element={<CbGoogle />} />
				</Routes>
			</Context.Provider>
			<ToastContainer />
		</div>
	);
}

export default App;