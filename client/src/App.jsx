import React, { useEffect, useState } from 'react';
import { Route, Routes, Navigate, useNavigate } from 'react-router-dom';
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
import NavBar from './components/NavBar';
import Logout from './components/Logout';

import './App.scss';
import './styles/bootstrap-social.css';
import 'react-toastify/dist/ReactToastify.css';

function App() {
	const nav = useNavigate();

	const [user, setUser] = useState();
	const [fetched, setFetched] = useState(false);
	const [secrets, setSecrets] = useState();

	useEffect(() => fetchData(), []);

	const fetchData = () => {
		setFetched(false);

		axios(`${process.env.REACT_APP_WEB_URL}/auth/login/success`)
			.then((res) => {
				setFetched(true);
				if (res.status === 200 && res.data.success) {
					console.log(res.data);

					const user = res.data.user;
					user.id = user._id;
					delete user._id;

					setUser(user);
				} else {
					// setUser({ id: 'test', username: 'demo_user', secrets: [{ secret: 'test', isPrivate: false }] });
					setUser();
					throw new Error('authentication has been failed!');
				}
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

	const logInOutHandler = () => {
		if (user?.id) {
			axios(`${process.env.REACT_APP_WEB_URL}/auth/logout`)
				.then((res) => {
					if (res.status === 200) {
						if (res.data.success) {
							fetchData();
							nav('/');
							toast.success('Logout successfully.');
						} else toast.error('Cannot logout.');
					} else {
						toast.error('Error accured when trying to logout.');
						throw new Error('Error accured when trying to logout.');
					}
				})
				.catch((err) => console.log(err));
		} else nav('/login');
	};

	return (
		<div className="App">
			<Context.Provider value={{ user, setUser, fetchData, secrets, fetched, logInOutHandler }}>
				<NavBar />
				<div className="container--app">
					<Routes>
						<Route exact path="/" element={<HomePage />} />
						<Route exact path="/login" element={<Login />} />
						<Route exact path="/register" element={<Register />} />
						<Route exact path="/secrets" element={<Secrets />} />
						<Route exact path="/submit" element={<Submit />} />
						<Route exact path="/cb/google" element={<CbGoogle />} />
						<Route exact path="/logout" element={<Logout />} />
						<Route path="/404" element={<NotFoundPage />} />
						<Route path="*" element={<Navigate to="/404" replace />} />
					</Routes>
				</div>
			</Context.Provider>
			<ToastContainer position="bottom-right" newestOnTop pauseOnFocusLoss={false} />
		</div>
	);
}

export default App;
