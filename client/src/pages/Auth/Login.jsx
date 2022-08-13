import React, { useEffect, useContext, useRef, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import Context from '../../Context';
import { toast } from 'react-toastify';
import { Button, Stack, Card, FloatingLabel, Form } from 'react-bootstrap';

import ButtonLoader from '../../components/ButtonLoader';
import SocialCard from '../../components/SocialCard';

import './Login.scss';

export default function Login() {
	const nav = useNavigate();

	const [fetching, setFetching] = useState();

	const { user, fetchData, toastUpdate } = useContext(Context);

	useEffect(() => {
		if (user?.id) {
			toast.warning('You already logged in. rediect you to Secrets page.');
			// nav('/secrets');
		}
		// eslint-disable-next-line
	}, [user]);

	const onFormSubmit = (e) => {
		e.preventDefault();

		setFetching(true);
		const toastId = toast.loading('Login...');
		console.log('fetch /auth/login');

		axios
			.post(`${process.env.REACT_APP_WEB_URL}/auth/login`, {
				username: loginRef.username.current.value,
				password: loginRef.password.current.value,
			})
			.then((res) => {
				setFetching(false);
				if (res.status === 200) {
					if (res.data.success) {
						fetchData();
						toastUpdate(toastId, 'success', 'Successfully logged in.');
						nav('/secrets');
					} else toastUpdate(toastId, 'error', 'Cannot login.');
				}
			})
			.catch((err) => {
				setFetching(false);
				toastUpdate(toastId, 'success', 'Invalid username or password.');
				console.log(err);
			});
	};

	const loginRef = { username: useRef(), password: useRef() };

	return (
		<div className="Login">
			<h1 className="display-3">Login</h1>

			<Stack gap={2} className="col-md-5 mx-auto">
				<Card className="login-local-container">
					<Card.Body>
						<Form onSubmit={onFormSubmit}>
							<FloatingLabel label="Email" controlId="login-email" className="mb-3">
								<Form.Control type="email" placeholder="Email" ref={loginRef.username} required />
							</FloatingLabel>
							<FloatingLabel label="Password" controlId="login-password" className="mb-3">
								<Form.Control type="password" placeholder="Password" ref={loginRef.password} required />
							</FloatingLabel>
							<div className="d-flex justify-content-between">
								{fetching ? (
									<ButtonLoader variant='danger' size='sm'/>
								) : (
									<Button type="submit" variant="dark me-auto">
										Login
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
