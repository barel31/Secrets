import React, { useEffect, useState } from 'react';
import { Route, Routes, Navigate, useNavigate } from 'react-router-dom';
import Context from './Context';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';

import HomePage from './components/HomePage/HomePage';
import Login from './components/Auth/Login';
import Logout from './components/Auth/Logout';
import Register from './components/Auth/Register';
import Secrets from './components/Secrets';
import Submit from './components/Submit';
import CallBack from './components/CallBack';
import NotFoundPage from './components/NotFoundPage';
import NavBar from './components/NavBar';
import Footer from './components/Footer';
import Feedback from './components/Feedback';

import './App.scss';
import './styles/bootstrap-social.css';
import 'react-toastify/dist/ReactToastify.css';

const toastUpdate = (id, type, str) =>
	toast.update(id, {
		render: str,
		type: type,
		isLoading: false,
		autoClose: 5000,
		closeOnClick: 'true',
	});

function App() {
	const isLocal3001 = window.location.href.includes('localhost:3001');

	const nav = useNavigate();

	const [user, setUser] = useState();
	const [fetched, setFetched] = useState(isLocal3001);
	const [secrets, setSecrets] = useState();

	// eslint-disable-next-line
	useEffect(() => fetchData(), []);

	const fetchData = (secretsOnly = false) => {
		if (!secretsOnly) {
			if (isLocal3001) {
				return setUser({
					id: 'test',
					username: 'demo_user',
					secrets: [
						{ secret: 'false', isPrivate: false, date: '2022-08-09T16:51:06.871Z' },
						{ secret: 'true', isPrivate: true, date: '2022-08-09T16:51:04.664Z' },
					],
				});
			}
			setFetched(false);

			axios(`${process.env.REACT_APP_WEB_URL}/auth/login/success`)
				.then((res) => {
					setFetched(true);

					if (res.status === 200) {
						if (res.data.success) {
							console.log(res.data);

							const user = res.data.user;
							user.id = user._id;
							delete user._id;

							setUser(user);
						} else setUser();
					} else throw new Error('authentication has been failed!');
				})
				.catch((err) => console.log(err));
		}

		axios
			.get(`${process.env.REACT_APP_WEB_URL}/api/secrets`)
			.then((res) => {
				if (res.status === 200) setSecrets(res.data.secrets);
				else throw new Error('Secrets fields request has been failed.');
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
			<Context.Provider value={{ user, setUser, fetchData, secrets, fetched, logInOutHandler, toastUpdate }}>
				<NavBar />
				<div className="app-container">
					<div className="app-inner-container">
						<Routes>
							<Route exact path="/" element={<HomePage />} />
							<Route exact path="/register" element={<Register />} />
							<Route exact path="/login" element={<Login />} />
							<Route exact path="/logout" element={<Logout />} />
							<Route exact path="/secrets" element={<Secrets />} />
							<Route exact path="/submit" element={<Submit />} />
							<Route exact path="/callback/google/success" element={<CallBack />} />
							<Route exact path="/callback/facebook/success" element={<CallBack />} />
							<Route exact path="/callback/login/failed" element={<CallBack />} />
							<Route exact path="/feedback" element={<Feedback />} />
							<Route path="/404" element={<NotFoundPage />} />
							<Route path="*" element={<Navigate to="/404" replace />} />
						</Routes>
					</div>
					<Footer />
				</div>
			</Context.Provider>
			<ToastContainer position="bottom-right" newestOnTop pauseOnFocusLoss={false} limit={3} />
		</div>
	);
}

export default App;
