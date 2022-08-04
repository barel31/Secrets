import React, { useEffect, useContext, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Context from '../../Context';

import './Login.scss';

export default function Login() {
	const nav = useNavigate();

	const { user, fetchData, toast } = useContext(Context);

	useEffect(() => {
		if (user) nav('/secrets');
	}, [user]);

	const google = () => {
		window.open(`${process.env.REACT_APP_WEB_URL}/auth/google`, '_self');
	};

	const onFormSubmit = (e) => {
		e.preventDefault();

		console.log('fetch /auth/login');
		axios
			.post(`${process.env.REACT_APP_WEB_URL}/auth/login`, {
				username: loginRef.username.current.value,
				password: loginRef.password.current.value,
			})
			.then((res) => {
				if (res.status === 200) {
					if (res.data.success) {
						fetchData();
						toast.success('Successfully logged in.');
						nav('/secrets');
					} else toast.error('Cannot login.');
				}
			})
			.catch((err) => {
				toast.error('Invalid username or password.');
				console.log(err);
			});
	};

	const loginRef = { username: useRef(), password: useRef() };

	return (
		<div className="Login container mt-5">
			<h1>Login</h1>

			<div className="row">
				<div className="col-sm-7">
					<div className="card">
						<div className="card-body login-local-container">
							<form onSubmit={onFormSubmit}>
								<div className="form-group">
									<label htmlFor="email">Email</label>
									<input type="email" className="form-control" ref={loginRef.username} required />
								</div>
								<div className="form-group">
									<label htmlFor="password">Password</label>
									<input type="password" className="form-control" ref={loginRef.password} required />
								</div>
								<button type="submit" className="btn btn-dark">
									Login
								</button>
							</form>
						</div>
					</div>
				</div>

				<div className="col-sm-3">
					<div className="card">
						<div className="card-body">
							<button type="submit" className="btn btn-block btn-social btn-google" onClick={google}>
								<i className="fab fa-google"></i>
								Sign In with Google
							</button>
						</div>

						<div className="card-body">
							<a className="btn btn-block btn-social btn-facebook" href="/auth/facebook" role="button">
								<i className="fab fa-facebook"></i>
								Login with Facebook
							</a>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
