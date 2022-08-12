import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import Context from '../Context';
import { Container, Nav, Navbar, Spinner } from 'react-bootstrap';

export default function NavBar() {
	const { user } = useContext(Context);

	return (
		<Navbar bg="light" expand="lg" collapseOnSelect sticky="top" className="Navbar">
			<Container>
				<Navbar.Brand>
					<Nav.Link as={Link} to="/">
						Secrets
					</Nav.Link>
				</Navbar.Brand>
				<Navbar.Toggle aria-controls="basic-navbar-nav d-flex" />
				<Navbar.Collapse>
					<Nav className="me-auto">
						<Nav.Link as={Link} to="/" className="nav-link" eventKey="1">
							Home
						</Nav.Link>
						<Nav.Link as={Link} to="/secrets" className="nav-link" eventKey="2">
							Secrets
						</Nav.Link>

						{user?.id && (
							<>
								<Nav.Link as={Link} to="/submit" className="nav-link" eventKey="3">
									Submit
								</Nav.Link>
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
								<Nav.Link as={Link} to="/logout" className="nav-link nav-link-logout" eventKey="4">
									Logout
								</Nav.Link>
							</Navbar.Text>
						) : (
							<>
								<Nav.Link as={Link} to="/login" className="nav-link" eventKey="5">
									Login
								</Nav.Link>
								<Nav.Link as={Link} to="/register" className="nav-link" eventKey="6">
									Register
								</Nav.Link>
							</>
						)}
						<Nav.Link as={Link} to="/feedback" className="nav-link" eventKey="7">
							Feedback
						</Nav.Link>
					</Nav>
				</Navbar.Collapse>
			</Container>
		</Navbar>
	);
}
