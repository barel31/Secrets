import React, { useContext, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Context from '../../Context';

import './HomePage.scss';

export default function HomePage() {
	const nav = useNavigate();
	const { user } = useContext(Context);

	useEffect(() => {
		if (user?.id) nav('/secrets');
		// eslint-disable-next-line
	}, [user]);

	return (
		<div className="HomePage">
			<h1 className="display-3">Secrets</h1>
			<p className="lead">Don't keep your secrets, share them anonymously!</p>
			<hr />
			<Link to={'/register'} className="btn btn-light btn-lg m-1">
				Register
			</Link>
			<Link to={'/login'} className="btn btn-dark btn-lg m-1">
				Login
			</Link>
		</div>
	);
}
