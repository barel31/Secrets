import React, { useContext } from 'react';
import { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Context from '../../Context';

import './HomePage.scss';

export default function HomePage() {
	const nav = useNavigate();
	const { user } = useContext(Context);

	useEffect(() => {
		if (user) nav('/secrets');
	}, [user]);

	return (
		<div className="HomePage jumbotron centered">
			<div className="container text-center">
				<i className="fas fa-key fa-6x" />
				<h1 className="display-3">Secrets</h1>
				<p className="lead">Don't keep your secrets, share them anonymously!</p>
				<p>user: {user}</p>
				<hr />
				<Link to={'/register'} className="btn btn-light btn-lg m-3">Register</Link>
				<Link to={'/login'} className="btn btn-dark btn-lg m-3">Login</Link>
			</div>
		</div>
	);
}
