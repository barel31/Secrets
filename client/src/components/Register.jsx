import React, { useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';

import axios from 'axios';

import './Login/Login.scss';
import { toast } from 'react-toastify';

export default function Register() {
	const nav = useNavigate();

	const onFormSubmit = (e) => {
		e.preventDefault();

		console.log('fetch /auth/register');
		axios
			.post(`${process.env.REACT_APP_WEB_URL}/auth/register`, {
				username: registerRef.username.current.value,
				password: registerRef.password.current.value,
			})
			.then((res) => {
				if (res.status === 200) {
					if (res.data.success) {
						console.log('register succesfully');
						toast.success('You have been registered successfully!');
						nav('/secrets');
					} else {
						toast.error('Username already exists, redirect to login page.');
						nav('/login');
					}
				}
			})
			.catch((err, res) => {
				console.log(err);
				toast.error('Cannot register user.');
			});
	};

	const registerRef = { username: useRef(), password: useRef() };

	const google = () => {
		window.open(`${process.env.REACT_APP_WEB_URL}/auth/google`, '_self');
	};
	
	return (
		<div className="Register container mt-5">
			<h1>Register</h1>

			<div className="row">
				<div className="col-sm-7">
					<div className="card">
						<div className="card-body register-local-container">
							<form onSubmit={onFormSubmit}>
								<div className="form-group">
									<label htmlFor="email">Email</label>
									<input type="email" className="form-control" ref={registerRef.username} required />
								</div>
								<div className="form-group">
									<label htmlFor="password">Password</label>
									<input
										type="password"
										className="form-control"
										ref={registerRef.password}
										required
									/>
								</div>
								<div className="d-flex">
									<button type="submit" className="btn btn-dark me-auto">
										Register
									</button>
									<Link to={'/'} className="btn btn-secondary">
										Home
									</Link>
								</div>
							</form>
						</div>
					</div>
				</div>

				<div className="col-sm-3">
					<div className="card">
						<div className="card-body">
							<button className="btn btn-block btn-social btn-google" onClick={google}>
								<i className="fab fa-google"></i>
								Sign In with Google
							</button>
						</div>

						<div className="card-body">
							<a className="btn btn-block btn-social btn-facebook" href="/auth/facebook">
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
