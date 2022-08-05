import React, { useEffect, useState } from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import Context from './Context';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';

import HomePage from './components/HomePage/HomePage';
import Login from './components/Login/Login';
import Register from './components/Register';
import Secrets from './components/Secrets';
import Submit from './components/Submit';
import CbGoogle from './components/CbGoogle';
import NotFoundPage from './components/NotFoundPage';

import './App.scss';
import './styles/bootstrap-social.css';
import 'react-toastify/dist/ReactToastify.css';

function App() {
	const [user, setUser] = useState();
	const [fetched, setFetched] = useState(false);
	const [secrets, setSecrets] = useState([]);

	useEffect(() => {
		fetchData();
	}, []);

	const fetchData = () => {
		setFetched(false);
		axios(`${process.env.REACT_APP_WEB_URL}/auth/login/success`)
			.then((res) => {
				if (res.status === 200) {
					setUser(res.data.success);
					setFetched(true);
				} else throw new Error('authentication has been failed!');
			})
			.catch((err) => console.log(err));

		axios
			.post(`${process.env.REACT_APP_WEB_URL}/api/secrets`)
			.then((res) => {
				if (res.status === 200) setSecrets(res.data.secrets);
				else throw new Error('authentication has been failed!');
			})
			.catch((err) => console.log(err));
	};

	return (
		<div className="App">
			<Context.Provider value={{ user, fetchData, secrets, toast, fetched }}>
				<Routes>
					<Route exact path="/" element={<HomePage />} />
					<Route exact path="/login" element={<Login />} />
					<Route exact path="/register" element={<Register />} />
					<Route exact path="/secrets" element={<Secrets />} />
					<Route exact path="/submit" element={<Submit />} />
					<Route exact path="/cb/google" element={<CbGoogle />} />
					<Route path="/404" element={<NotFoundPage />} />
					<Route path="*" element={<Navigate to="/404" replace />} />
				</Routes>
			</Context.Provider>
			<ToastContainer />
		</div>
	);
}

export default App;
