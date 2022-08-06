import React, { useState, useEffect, useContext, useRef } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Context from '../Context';
import { Button, Form, InputGroup, Spinner } from 'react-bootstrap';
import { toast } from 'react-toastify';

export default function Submit() {
	const [fetchState, setFetchState] = useState(-1);

	const { user, fetched, fetchData } = useContext(Context);

	const secretInput = useRef();
	const privateCheck = useRef();
	const privateCheckDelete = useRef([]);

	useEffect(() => {
		if (fetched && !user?.id) {
			toast.warn("You're not logged in. Redirect to login page.");
			// nav('/login');
		}
	}, [fetched]);

	const deleteSecret = (secretIndex) => {
		setFetchState(secretIndex);

		axios
			.post(`${process.env.REACT_APP_WEB_URL}/api/user/delete`, { secretIndex })
			.then((res) => {
				setFetchState(-1);
				if (res.status === 200) {
					toast.success('Secret deleted successfully!');
					user.secrets.splice(secretIndex, 1);
				} else {
					toast.error('ERROR: Cannot delete secret.');
					throw new Error('Cannot delete secret.');
				}
			})
			.catch((err) => {
				setFetchState(-1);
				toast.error('ERROR: Cannot delete secret.');
				console.log(err);
			});
	};

	const onFormSubmit = (e) => {
		e.preventDefault();

		setFetchState(-2);

		const secret = secretInput.current.value;
		const isPrivate = privateCheck.current.value;
		const isPrivateDelete = privateCheckDelete.current.value;
		axios
			.post(`${process.env.REACT_APP_WEB_URL}/api/submit`, { secret, isPrivate })
			.then((res) => {
				if (res.status === 200) {
					fetchData();
					toast.success(`Successfully created new secret: ${secret}`);
					console.log(res.data);
					secretInput.current.value = '';
				} else {
					toast.error(`Cannot add secret`);
					throw new Error('Cannot add secret.');
				}
				setFetchState(-1);
			})
			.catch((err) => {
				setFetchState(-1);
				toast.error('ERROR: Cannot submit secret.');
				console.log(err);
			});
	};

	return (
		<div className="Submit container text-center mt-5">
			<div className="jumbotron centered">
				<i className="fas fa-key fa-6x"></i>
				<h1 className="display-3">Secrets</h1>
				<p className="secret-text">Don't keep your secrets, share them anonymously!</p>

				<div className="secret-list">
					{user?.secrets?.length ? (
						user.secrets?.map((secret, i) => (
							<InputGroup key={i} className="mb-3">
								<Form.Control
									placeholder={secret.secret}
									aria-label={secret.secret}
									aria-describedby={secret.secret}
									disabled
								/>
								<InputGroup.Text className='' style={{ display: 'block' }}>
									Private
									<Form.Switch type="switch" ref={privateCheckDelete[i]} />
								</InputGroup.Text>

								{fetchState === i ? (
									<Button variant="danger" disabled>
										<Spinner
											as="span"
											animation="border"
											size="sm"
											role="status"
											aria-hidden="true"
										/>
										<span className="visually-hidden">Loading...</span>
									</Button>
								) : (
									<Button variant="btn btn-danger" onClick={() => deleteSecret(i)}>
										Delete
									</Button>
								)}
							</InputGroup>
						))
					) : user?.id ? (
						<p className="secret-text">You didn't submit any secret yet.</p>
					) : (
						<Spinner animation="border" variant="dark" />
					)}
				</div>

				<form onSubmit={onFormSubmit}>
					<input
						type="text"
						className="form-control text-center mb-3"
						name="secret"
						placeholder="What's your secret?"
						ref={secretInput}
						required
					/>

					<Form.Switch type="switch" label="Private?" ref={privateCheck} />

					{fetchState === -2 ? (
						<Button variant="dark" disabled>
							<Spinner as="span" animation="border" size="sm" aria-hidden="true" />
						</Button>
					) : (
						<button type="submit" className="btn btn-dark m-3">
							Submit
						</button>
					)}

					<Link to={'/'} className="btn btn-secondary m-3">
						Home
					</Link>
				</form>
			</div>
		</div>
	);
}
