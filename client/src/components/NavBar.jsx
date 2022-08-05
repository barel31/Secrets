import React, { useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import Context from '../Context';
import { Container, Nav, Navbar } from 'react-bootstrap';
import axios from 'axios';

export default function NavBar() {
	const { user, fetched, setUser, logInOutHandler } = useContext(Context);

	const fetchUserName = () => {
		console.log('fetch /api/username');
		axios(`${process.env.REACT_APP_WEB_URL}/api/username`)
			.then((res) => {
				console.log(res.data);
				setUser({ ...user, username: res.data.username });
			})
			.catch((err) => console.log(err));
	};

	useEffect(() => {
		console.log({ user, fetched });
		if (user && fetched) fetchUserName();
	}, [fetched]);

	return (
		<Navbar bg="light" expand="lg">
			<Container>
				<Navbar.Brand>
					<Link to={'/'} className="nav-link">
						Secrets
					</Link>
				</Navbar.Brand>
				<Navbar.Toggle aria-controls="basic-navbar-nav d-flex" />
				<Navbar.Collapse>
					<Nav className="me-auto">
						<Link className="nav-link" to={'/'}>
							Home
						</Link>

						<Link className="nav-link" to={'/secrets'}>
							Secrets
						</Link>
						{user && (
							<>
								<Nav>
									<Link className="nav-link" to={'/submit'}>
										Submit
									</Link>
								</Nav>
							</>
						)}
					</Nav>
					<Nav>
						{user ? (
							<>
								<Navbar.Text>
									Signed in as: {user.username}
									<Nav.Link className="nav-link navbar-logout-link" onClick={logInOutHandler}>
										Logout
									</Nav.Link>
								</Navbar.Text>
							</>
						) : (
							<Link className="nav-link" to={'/login'}>
								Login
							</Link>
						)}
					</Nav>
				</Navbar.Collapse>
			</Container>
		</Navbar>
	);
}
