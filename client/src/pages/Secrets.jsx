import React, { useContext, useEffect, useState, useRef } from 'react';
import Context from '../Context';
import { Link } from 'react-router-dom';
import { Spinner, InputGroup, Form, Button } from 'react-bootstrap';

export default function Secrets() {
	const { user, secrets, fetchData } = useContext(Context);

	const [secretFiltered, setSecretFiltered] = useState();

	const searchValue = useRef();

	// eslint-disable-next-line
	useEffect(() => fetchData(true), []);

	// eslint-disable-next-line
	useEffect(() => secrets && onSearch(), [secrets]);

	const onSearch = () => {
		const result = secrets.filter((secret) =>
			secret.toLowerCase().includes(searchValue.current.value.toLowerCase())
		);
		setSecretFiltered(result);
	};

	return (
		<div className="Secrets">
			<h1 className="display-3">You've Discovered My Secret!</h1>

			<InputGroup className="mb-3">
				<Form.Control placeholder="Search" aria-label="Search" ref={searchValue} onChange={onSearch} />
				<Button variant="primary" onClick={onSearch}>
					<i className="fas fa-search" />
				</Button>
			</InputGroup>

			{secretFiltered ? (
				secretFiltered.length ? (
					secretFiltered.map((secret, i) => (
						<p key={i} className="secret-text">
							{secret}
						</p>
					))
				) : (
					<p className="display-6">No Secrets found!</p>
				)
			) : (
				<Spinner animation="border" variant="dark" />
			)}
			<hr />
			<Link to={user?.id ? '/logout' : '/login'} className="btn btn-dark btn-lg m-1">
				{user?.id ? 'Logout' : 'Login'}
			</Link>
			<Link to={user?.id ? '/submit' : '/register'} className="btn btn-dark btn-lg m-1">
				{user?.id ? 'Submit a Secret' : 'Register'}
			</Link>
		</div>
	);
}
