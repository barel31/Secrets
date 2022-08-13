import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Context from '../Context';
import { Button, Form, InputGroup, Spinner } from 'react-bootstrap';
import { toast } from 'react-toastify';
import date from 'date-and-time';

import ButtonLoader from '../components/ButtonLoader';

export default function Submit() {
	const nav = useNavigate();

	const [fetchState, setFetchState] = useState({ switch: -1, button: -1 });

	const { user, fetched, fetchData, toastUpdate } = useContext(Context);

	useEffect(() => {
		if (fetched && !user?.id) {
			toast.warn("You're not logged in. Redirect to login page.");
			nav('/login');
		}
		// eslint-disable-next-line
	}, [fetched]);

	const deleteSecret = (secretIndex) => {
		if (!window.confirm('Are you sure you want delete your secret?')) return;

		setFetchState((prev) => ({ ...prev, button: secretIndex }));
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
					throw new Error('Cannot delete secret.errr');
				}
			})
			.catch((err) => {
				setFetchState({ switch: -1, button: -1 });
				toastUpdate(toastId, 'error', err);
				console.log(err);
			});
	};

	const changeSecretState = (secretIndex, isPrivate) => {
		setFetchState((prev) => ({ ...prev, switch: secretIndex }));
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

		setFetchState((prev) => ({ ...prev, button: -2 }));
		const toastId = toast.loading('Submiting...');

		axios
			.post(`${process.env.REACT_APP_WEB_URL}/api/user/secrets`, {
				secret: e.target.secret.value,
				isPrivate: false,
			})
			.then((res) => {
				setFetchState({ switch: -1, button: -1 });

				if (res.status === 200) {
					fetchData();
					toastUpdate(toastId, 'success', `Successfully created new secret: ${e.target.secret.value}`);
					console.log(res.data);
					e.target.secret.value = '';
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
		<div className="Submit">
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
								<ButtonLoader variant="danger" size="sm" />
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
					<ButtonLoader variant="dark" size="lg" />
				)}
			</div>

			<Form onSubmit={submitSecret}>
				<Form.Control
					type="text"
					className="form-control text-center mb-3"
					name="secret"
					placeholder="What's your secret?"
					required
				/>

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
			</Form>
		</div>
	);
}
