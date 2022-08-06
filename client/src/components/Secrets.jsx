import React, { useContext, useEffect } from 'react';
import Context from '../Context';
import { Link } from 'react-router-dom';
import { Spinner } from 'react-bootstrap';

export default function Secrets() {
	const { user, secrets, logInOutHandler, fetchData } = useContext(Context);

	useEffect(() => fetchData(true), []);

	return (
		<div className="Secrets jumbotron centered">
			<div className="jumbotron text-center">
				<div className="container">
					<i className="fas fa-key fa-6x"></i>
					<h1 className="display-3">You've Discovered My Secret!</h1>
					{secrets ? (
						secrets.length ? (
							secrets.map((secret, i) => (
								<p key={i} className="secret-text">
									{secret}
								</p>
							))
						) : (
							<p className="secret-text">No Secrets submited yet, You can be the first!</p>
						)
					) : (
						<Spinner animation="border" variant="dark" />
					)}
					<hr />
					<button className="btn btn-light btn-lg m-1" onClick={logInOutHandler}>
						{user?.id ? 'Log Out' : 'Login'}
					</button>
					<Link to={user?.id ? '/submit' : '/register'} className="btn btn-dark btn-lg m-1">
						{user?.id ? 'Submit a Secret' : 'Register'}
					</Link>
				</div>
			</div>
		</div>
	);
}
