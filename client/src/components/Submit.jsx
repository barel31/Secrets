import React, { useState, useEffect, useContext, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Context from '../Context';
import { Button, Form, InputGroup, Spinner } from 'react-bootstrap';
import { toast } from 'react-toastify';
import date from 'date-and-time';

export default function Submit() {
	const nav = useNavigate();

	const [fetchState, setFetchState] = useState({ switch: -1, button: -1 });

	const { user, fetched, fetchData, toastUpdate } = useContext(Context);

	const secretInput = useRef();

	useEffect(() => {
		if (fetched && !user?.id) {
			toast.warn("You're not logged in. Redirect to login page.");
			nav('/login');
		}
	// eslint-disable-next-line
	}, [fetched]);

	const deleteSecret = (secretIndex) => {
		if (!window.confirm('Are you sure you want delete your secret?')) return;

		setFetchState({ ...fetchState, button: secretIndex });

		const toastId = toast.loading('Deleting secret...');
		axios
			.delete(`${process.env.REACT_APP_WEB_URL}/api/user/secrets`, { secretIndex })
			.then((res) => {
				setFetchState({ switch: -1, button: -1 });
				if (res.status === 200) {
					toastUpdate(toastId, 'success', 'Secret deleted successfully!');
					user.secrets.splice(secretIndex, 1);
				} else {
					toastUpdate(toastId, 'error', 'ERROR: Cannot delete secret.');
					throw new Error('Cannot delete secret.');
				}
			})
			.catch((err) => {
				setFetchState({ switch: -1, button: -1 });
				toastUpdate(toastId, 'error', 'ERROR: Cannot delete secret.');
				console.log(err);
			});
	};

	const changeSecretState = (secretIndex, isPrivate) => {
		setFetchState({ ...fetchState, switch: secretIndex });
		const toastId = toast.loading('Updating secret...');

		axios
			.patch(`${process.env.REACT_APP_WEB_URL}/api/user/secrets`, { secretIndex, isPrivate })
			.then((res) => {
				setFetchState({ switch: -1, button: -1 });

				if (res.status === 200) {
					toastUpdate(toastId, 'success', 'Secret state updated successfully!');
					user.secrets[secretIndex].isPrivate = isPrivate;
				} else {
					toastUpdate(toastId, 'error', 'ERROR: Cannot change secret state.');
					throw new Error('Cannot change secret state.');
				}
			})
			.catch((err) => {
				setFetchState({ switch: -1, button: -1 });
				toastUpdate(toastId, 'error', 'ERROR: Cannot change secret state.');
				console.log(err);
			});
	};

	const submitSecret = (e) => {
		e.preventDefault();

		setFetchState({ ...fetchState, button: -2 });
		const toastId = toast.loading('Submiting...');

		const secret = secretInput.current.value;

		axios
			.post(`${process.env.REACT_APP_WEB_URL}/api/user/secrets`, { secret, isPrivate: false })
			.then((res) => {
				setFetchState({ switch: -1, button: -1 });

				if (res.status === 200) {
					fetchData();
					toastUpdate(toastId, 'success', `Successfully created new secret: ${secret}`);
					console.log(res.data);
					secretInput.current.value = '';
				} else {
					toastUpdate(toastId, 'error', 'ERROR: Cannot add secret.');

					throw new Error('Cannot add secret.');
				}
			})
			.catch((err) => {
				setFetchState({ switch: -1, button: -1 });
				toastUpdate(toastId, 'error', 'ERROR: Cannot add secret.');
				console.log(err);
			});
	};

	return (
		<div className="Submit container text-center mt-5">
			<div className="jumbotron centered">
				<i className="fas fa-key fa-6x"></i>
				<h1 className="display-3">Your Secrets</h1>

				<div className="secret-list">
					{user?.secrets?.length ? (
						user.secrets?.map((secret, i) => (
							<InputGroup key={i} className="mb-3">
								<InputGroup.Text>{date.format(new Date(secret.date), 'DD/M/YY HH:mm')}</InputGroup.Text>
								<Form.Control
									placeholder={secret.secret}
									aria-label={secret.secret}
									aria-describedby={secret.secret}
									disabled
								/>
								<InputGroup.Text>
									{fetchState.switch === i ? (
										<Form.Switch type="switch" checked={!secret.isPrivate} disabled />
									) : (
										<Form.Switch
											type="switch"
											size={'sm'}
											checked={!secret.isPrivate}
											onChange={(e) => changeSecretState(i, !e.target.checked)}
										/>
									)}
								</InputGroup.Text>

								{fetchState.button === i ? (
									<Button variant="danger" disabled>
										<Spinner
											as="span"
											animation="border"
											size="lg"
											role="status"
											aria-hidden="true"
											variant=""
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

				<form onSubmit={submitSecret}>
					<input
						type="text"
						className="form-control text-center mb-3"
						name="secret"
						placeholder="What's your secret?"
						ref={secretInput}
						required
					/>

					{/* <FormCheck type="switch" label="Private?" onChange={(e) => setPrivateCheck(e.target.checked)} /> */}

					{fetchState.button === -2 ? (
						<Button variant="dark" disabled>
							<Spinner as="span" animation="border" size="sm" aria-hidden="true" />
						</Button>
					) : (
						<Button type="submit" variant="dark m-3">
							Submit
						</Button>
					)}

					<Link to={'/'} className="btn btn-secondary m-3">
						Home
					</Link>
				</form>
			</div>
		</div>
	);
}
