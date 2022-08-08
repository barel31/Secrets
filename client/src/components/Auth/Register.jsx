import React, { useState, useRef,useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button, Spinner } from 'react-bootstrap';
import { toast } from 'react-toastify';
import axios from 'axios';
import Context from '../../Context';

import './Login.scss';

export default function Register() {
	const { toastUpdate } = useContext(Context);

	const nav = useNavigate();

	const [fetching, setFetching] = useState();

	const onFormSubmit = (e) => {
		e.preventDefault();
		setFetching(true);

		const toastId = toast.loading('Registering...');
		console.log('fetch /auth/register');

		axios
			.post(`${process.env.REACT_APP_WEB_URL}/auth/register`, {
				username: registerRef.username.current.value,
				password: registerRef.password.current.value,
			})
			.then((res) => {
				setFetching(false);
				if (res.status === 200) {
					if (res.data.success) {
						console.log('Registered successfully');
						toastUpdate(toastId, 'success', 'You have been registered successfully!');
						nav('/secrets');
					} else {
						toastUpdate(toastId, 'error', 'Username already exists, redirect to login page.');

						nav('/login');
					}
				}
			})
			.catch((err, res) => {
				setFetching(false);
				console.log(err);
				toast.update(toastId, { render: 'Cannot register user.', type: 'error', isLoading: false });
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
									{fetching ? (
										<Button variant="dark me-auto" disabled>
											<Spinner
												as="span"
												animation="border"
												size="sm"
												role="status"
												aria-hidden="true"
											/>
											<span className="visually-hidden">Loading...</span>
										</Button>
									) : (
										<Button type="submit" variant="dark me-auto">
											Register
										</Button>
									)}
									<Button as={Link} to={'/'} variant="secondary">
										Home
									</Button>
								</div>
							</form>
						</div>
					</div>
				</div>

				<div className="col-sm-3 mt-5">
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
