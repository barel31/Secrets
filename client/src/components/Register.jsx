import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import './Login.scss';

export default function HomePage() {
	const nav = useNavigate();

	const [data, setData] = useState('');

	useEffect(() => {
		axios('http://localhost:3000/express-test')
			.then((data) => setData(data.data.connected))
			.catch((err) => console.log(err));
	}, []);

	return (
		<div className="Register container mt-5">
			<h1>Register</h1>

			<div className="row">
				<div className="col-sm-7">
					<div className="card">
						<div className="card-body register-local-container">
							<form action="/api/register" method="POST">
								<div className="form-group">
									<label htmlFor="email">Email</label>
									<input type="email" className="form-control" name="username" />
								</div>
								<div className="form-group">
									<label htmlFor="password">Password</label>
									<input type="password" className="form-control" name="password" />
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
