import React, { useContext } from 'react';
import Context from '../Context';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

export default function Secrets() {
	const nav = useNavigate();

	const { user, secrets, fetchData, toast } = useContext(Context);

	const logInOutHandler = () => {
		if (user) {
			axios(`${process.env.REACT_APP_WEB_URL}/auth/logout`)
				.then((res) => {
					if (res.status === 200) {
						if (res.data.success) {
							fetchData();
							nav('/');
							toast.success('Logout successfully.');
						} else toast.error('Cannot logout.');
					}
				})
				.catch((err) => console.log(err));
		} else nav('/login');
	};

	return (
		<div className="Secrets jumbotron centered">
			<div className="jumbotron text-center">
				<div className="container">
					<i className="fas fa-key fa-6x"></i>
					<h1 className="display-3">You've Discovered My Secret!</h1>
					{secrets ? (
						secrets.map((secret, i) => (
							<p key={i} className="secret-text">
								{secret}
							</p>
						))
					) : (
						<p className="secret-text">Loading...</p>
					)}
					<hr />
					<button className="btn btn-light btn-lg m-1" onClick={logInOutHandler}>
						{user ? 'Log Out' : 'Login'}
					</button>
					<Link to={user ? '/submit' : '/register'} className="btn btn-dark btn-lg m-1">{user ? 'Submit a Secret' : 'Register'}</Link>
				</div>
			</div>
		</div>
	);
}
