import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import Context from '../Context';
import { Container, Nav, Navbar, Spinner } from 'react-bootstrap';

export default function NavBar() {
	const { user } = useContext(Context);

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
						{user?.id && (
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
						{user?.id ? (
							<Navbar.Text>
								Signed in as:{' '}
								{user.username ? (
									user.username
								) : (
									<Spinner animation="border" variant="dark" size="sm" />
								)}
								<Link className="nav-link navbar-logout-link" to={'/logout'}>
									Logout
								</Link>
							</Navbar.Text>
						) : (
							<Link className="nav-link navbar-login-link" to={'/login'}>
								Login
							</Link>
						)}
					</Nav>
				</Navbar.Collapse>
			</Container>
		</Navbar>
	);
}
