import React, { useEffect, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Context from '../Context';
import { Container, Nav, Navbar, NavDropdown } from 'react-bootstrap';

export default function NavBar() {
	const nav = useNavigate();

	const { user, toast } = useContext(Context);

	useEffect(() => {}, []);

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
									<Link className="nav-link" style={{ display: 'inline' }} to={'/logout'}>
										Logout
									</Link>
								</Navbar.Text>
							</>
						) : (
							<Link className="nav-link" to={'/login'}>
								Login
							</Link>
						)}
					</Nav>
					{/* <NavDropdown title="Dropdown" id="basic-nav-dropdown">
							<NavDropdown.Item href="#action/3.2">Another action</NavDropdown.Item>
							<NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
							<NavDropdown.Divider />
							<NavDropdown.Item href="#action/3.4">Separated link</NavDropdown.Item>
						</NavDropdown> */}
				</Navbar.Collapse>
			</Container>
		</Navbar>
	);
}
