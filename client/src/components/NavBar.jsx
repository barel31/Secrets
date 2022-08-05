import React, { useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Context from '../Context';
import { Container, Nav, Navbar } from 'react-bootstrap';

export default function NavBar() {
	const nav = useNavigate();

	const { user, logInOutHandler } = useContext(Context);

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
									Signed in as: {user}
									<Nav.Link
										className="nav-link navbar-logout-link"
										onClick={logInOutHandler}>
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
