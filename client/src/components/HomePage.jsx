import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import './HomePage.scss';

export default function HomePage() {
	const nav = useNavigate();

	const [data, setData] = useState('');

	useEffect(() => {
		axios('http://localhost:3000/express-test')
			.then((data) => setData(data.data.connected))
			.catch((err) => console.log(err));
	}, []);

	return (
		<div className="HomePage jumbotron centered">
			<div className="container text-center">
				<i className="fas fa-key fa-6x" />
				<h1 className="display-3">Secrets {data}</h1>
				<p className="lead">Don't keep your secrets, share them anonymously!</p>
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
