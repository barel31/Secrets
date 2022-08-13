import React, { useState, useRef, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button, Stack, Form, FloatingLabel, Card } from 'react-bootstrap';
import { toast } from 'react-toastify';
import axios from 'axios';
import Context from '../../Context';

import ButtonLoader from '../../components/ButtonLoader';
import SocialCard from '../../components/SocialCard';

import './Login.scss';

export default function Register() {
	const { toastUpdate } = useContext(Context);

	const nav = useNavigate();

	const [fetching, setFetching] = useState();

	const onFormSubmit = (e) => {
		e.preventDefault();
		setFetching(true);

		const toastId = toast.loading('Registering...');
		console.log('fetch /auth/register');

		axios
			.post(`${process.env.REACT_APP_WEB_URL}/auth/register`, {
				username: registerRef.username.current.value,
				password: registerRef.password.current.value,
			})
			.then((res) => {
				setFetching(false);
				if (res.status === 200) {
					if (res.data.success) {
						console.log('Registered successfully');
						toastUpdate(toastId, 'success', 'You have been registered successfully!');
						nav('/secrets');
					} else {
						toastUpdate(toastId, 'error', 'Username already exists, redirect to login page.');

						nav('/login');
					}
				}
			})
			.catch((err, res) => {
				setFetching(false);
				console.log(err);
				toast.update(toastId, { render: 'Cannot register user.', type: 'error', isLoading: false });
			});
	};

	const registerRef = { username: useRef(), password: useRef() };

	return (
		<div className="Register">
			<h1 className="display-3">Register</h1>

			<Stack gap={2} className="col-md-5 mx-auto">
				<Card className="register-local-container">
					<Card.Body>
						<Form onSubmit={onFormSubmit}>
							<FloatingLabel label="Email" controlId="register-email" className="mb-3">
								<Form.Control type="email" placeholder="Email" ref={registerRef.username} required />
							</FloatingLabel>
							<FloatingLabel label="Password" controlId="register-password" className="mb-3">
								<Form.Control
									type="password"
									placeholder="Password"
									ref={registerRef.password}
									required
								/>
							</FloatingLabel>
							<div className="d-flex justify-content-between">
								{fetching ? (
									<ButtonLoader variant='danger' size='sm'/>
								) : (
									<Button type="submit" variant="dark me-auto">
										Register
									</Button>
								)}
								<Button as={Link} to={'/'} variant="secondary">
									Home
								</Button>
							</div>
						</Form>
					</Card.Body>
				</Card>

				<SocialCard />
			</Stack>
		</div>
	);
}
