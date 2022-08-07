import React, { useState, useEffect, useContext, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Context from '../Context';
import { Button, Form, InputGroup, Spinner } from 'react-bootstrap';
import { toast } from 'react-toastify';

export default function Submit() {
	const nav = useNavigate();

	const [fetchState, setFetchState] = useState({ switch: -1, button: -1 });
	const [privateCheck, setPrivateCheck] = useState(false);

	const { user, fetched, fetchData } = useContext(Context);

	const secretInput = useRef();

	useEffect(() => {
		if (fetched && !user?.id) {
			toast.warn("You're not logged in. Redirect to login page.");
			nav('/login');
		}
	}, [fetched]);

	const deleteSecret = (secretIndex) => {
		setFetchState({ ...fetchState, button: secretIndex });

		axios
			.delete(`${process.env.REACT_APP_WEB_URL}/api/user/secrets`, { secretIndex })
			.then((res) => {
				setFetchState({ switch: -1, button: -1 });
				if (res.status === 200) {
					toast.success('Secret deleted successfully!');
					user.secrets.splice(secretIndex, 1);
				} else {
					toast.error('ERROR: Cannot delete secret.');
					throw new Error('Cannot delete secret.');
				}
			})
			.catch((err) => {
				setFetchState({ switch: -1, button: -1 });
				toast.error('ERROR: Cannot delete secret.');
				console.log(err);
			});
	};

	const changeSecretState = (secretIndex, isPrivate) => {
		setFetchState({ ...fetchState, switch: secretIndex });

		axios
			.patch(`${process.env.REACT_APP_WEB_URL}/api/user/secrets`, { secretIndex, isPrivate })
			.then((res) => {
				setFetchState({ switch: -1, button: -1 });
				if (res.status === 200) {
					toast.success('Secret state updated successfully!');
					user.secrets[secretIndex].isPrivate = isPrivate;
				} else {
					toast.error('ERROR: Cannot change secret state.');
					throw new Error('Cannot change secret state.');
				}
			})
			.catch((err) => {
				setFetchState({ switch: -1, button: -1 });
				toast.error('ERROR: Cannot change secret state.');
				console.log(err);
			});
	};

	const submitSecret = (e) => {
		e.preventDefault();

		setFetchState({ ...fetchState, button: -2 });
		const secret = secretInput.current.value;

		axios
			.post(`${process.env.REACT_APP_WEB_URL}/api/user/secrets`, { secret, isPrivate: privateCheck })
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
				setFetchState({ switch: -1, button: -1 });
			})
			.catch((err) => {
				setFetchState({ switch: -1, button: -1 });
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
