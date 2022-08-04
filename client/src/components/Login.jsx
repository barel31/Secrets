import React, { useEffect, useState, useContext } from 'react';
// import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Context from '../Context';

import './Login.scss';

export default function HomePage() {
	// const nav = useNavigate();

	const { user } = useContext(Context);
	console.log(user);

	return (
		<div className="Login container mt-5">
			<h1>Login {user}</h1>

			<div className="row">
				<div className="col-sm-7">
					<div className="card">
						<div className="card-body login-local-container">
							<form action="http://localhost:3000/login" method="POST">
								<div className="form-group">
									<label htmlFor="email">Email</label>
									<input type="email" className="form-control" name="username" required />
								</div>
								<div className="form-group">
									<label htmlFor="password">Password</label>
									<input type="password" className="form-control" name="password" required />
								</div>
								<button type="submit" className="btn btn-dark" onSubmit={() => {}}>
									Login
								</button>
							</form>
						</div>
					</div>
				</div>

				<div className="col-sm-3">
					<div className="card">
						<div className="card-body">
							<form action="/api/user" method="post">
								<button type="submit" className="btn btn-block btn-social btn-google">
									<i className="fab fa-google"></i>
									Sign In with Google
								</button>
							</form>
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
