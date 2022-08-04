import React, { useContext, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Context from '../Context';

import axios from 'axios';

import './Login/Login.scss';

export default function Register() {
	const nav = useNavigate();
	const { toast } = useContext(Context);

	const onFormSubmit = (e) => {
		e.preventDefault();

		console.log('fetch /auth/register');
		axios
			.post('http://localhost:3000/auth/register', {
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
				console.log('Cannot register user.');
			});
	};

	const registerRef = { username: useRef(), password: useRef() };

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
								<button type="submit" className="btn btn-dark">
									Register
								</button>
							</form>
						</div>
					</div>
				</div>

				<div className="col-sm-3">
					<div className="card">
						<div className="card-body">
							<a className="btn btn-block btn-social btn-google" href="/auth/google" role="button">
								<i className="fab fa-google"></i>
								Sign In with Google
							</a>
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
