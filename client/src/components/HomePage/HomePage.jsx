import React, { useContext } from 'react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
				<button type="button" onClick={() => nav('/register')} className="btn btn-light btn-lg">
					Register
				</button>
				<button type="button" onClick={() => nav('/login')} className="btn btn-dark btn-lg">
					Login
				</button>
			</div>
		</div>
	);
}
