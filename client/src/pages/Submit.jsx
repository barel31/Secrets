import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Context from '../Context';
import { Button, Form, InputGroup } from 'react-bootstrap';
import { toast } from 'react-toastify';
import date from 'date-and-time';

import ButtonLoader from '../components/ButtonLoader';
import { FaTrash } from 'react-icons/fa';
import { BsPencilFill, BsCheckLg } from 'react-icons/bs';
import { ImCancelCircle } from 'react-icons/im';

export default function Submit() {
	//TODO - Make component for each secret render to achieve less lines per file
	//TODO - Make it easier to see secret text on mobile devices
	const nav = useNavigate();

	const [fetchState, setFetchState] = useState(-1);

	const [editState, setEditState] = useState({ index: -1, text: '' });

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

		setFetchState(secretIndex);
		const toastId = toast.loading('Deleting secret...');

		axios
			.delete(`${process.env.REACT_APP_WEB_URL}/api/user/secrets`, { secretIndex })
			.then((res) => {
				setFetchState(-1);

				if (res.status === 200) {
					toastUpdate(toastId, 'success', 'Secret deleted successfully!');
					user.secrets.splice(secretIndex, 1);
				} else {
					toastUpdate(toastId, 'error', 'ERROR: Cannot delete secret.');
					// throw new Error('Cannot delete secret.');
				}
			})
			.catch((err) => {
				setFetchState(-1);
				toastUpdate(toastId, 'error', err);
				console.log(err);
			});
	};

	const editSecret = (secretIndex) => {
		const secretText = user.secrets[secretIndex].secret;
		setEditState(() => ({ index: secretIndex, text: secretText }));

		const editedElement = document.getElementById(`secret-list-${secretIndex}`);
		editedElement.value = secretText;
		setTimeout(() => editedElement.focus(), 0);
	};

	const saveEditedSecret = () => {
		const secretIndex = editState.index;
		setFetchState(secretIndex);
		const toastId = toast.loading('Editing secret...');

		axios
			.patch(`${process.env.REACT_APP_WEB_URL}/api/user/secrets`, { secretIndex, secretText: editState.text })
			.then((res) => {
				setFetchState(-1);
				setEditState(() => ({ index: -1, text: '' }));

				if (res.status === 200) {
					toastUpdate(toastId, 'success', 'Secret updated successfully!');
					user.secrets[secretIndex].secret = editState.text;
				} else {
					toastUpdate(toastId, 'error', 'ERROR: Cannot edit secret.');
					throw new Error('Cannot edit secret.');
				}
			})
			.catch((err) => {
				setFetchState(-1);
				setEditState(() => ({ index: -1, text: '' }));
				toastUpdate(toastId, 'error', 'ERROR: Cannot edit secret.');
				console.log(err);
			});
	};

	const cancelEditSecret = () => {
		document.getElementById(`secret-list-${editState.index}`).value = '';
		setEditState(() => ({ index: -1, text: '' }));
	};

	const changeSecretState = (secretIndex, isPrivate) => {
		setFetchState(secretIndex);
		const toastId = toast.loading('Updating secret...');

		axios
			.patch(`${process.env.REACT_APP_WEB_URL}/api/user/secrets`, { secretIndex, isPrivate })
			.then((res) => {
				setFetchState(-1);

				if (res.status === 200) {
					toastUpdate(toastId, 'success', 'Secret state updated successfully!');
					user.secrets[secretIndex].isPrivate = isPrivate;
				} else {
					toastUpdate(toastId, 'error', 'ERROR: Cannot change secret state.');
					throw new Error('Cannot change secret state.');
				}
			})
			.catch((err) => {
				toastUpdate(toastId, 'error', 'ERROR: Cannot change secret state.');
				setFetchState(-1);
				console.log(err);
			});
	};

	const submitSecret = (e) => {
		e.preventDefault();
		setFetchState(-2);
		const toastId = toast.loading('Submiting...');

		axios
			.post(`${process.env.REACT_APP_WEB_URL}/api/user/secrets`, {
				secret: e.target.secret.value,
				isPrivate: false,
			})
			.then((res) => {
				setFetchState(-1);

				if (res.status === 200) {
					fetchData();
					toastUpdate(toastId, 'success', `Successfully created new secret: ${e.target.secret.value}`);
					e.target.secret.value = '';
				} else {
					toastUpdate(toastId, 'error', 'ERROR: Cannot add secret.');
					throw new Error('Cannot add secret.');
				}
			})
			.catch((err) => {
				setFetchState(-1);
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
								disabled={editState.index !== i}
								id={`secret-list-${i}`}
								onChange={(e) =>
									editState.index === i && setEditState((prev) => ({ ...prev, text: e.target.value }))
								}
								onKeyDown={(e) => {
									if (editState.index === i) {
										if (e.key === 'Enter') saveEditedSecret();
										else if (e.key === 'Escape') cancelEditSecret();
									}
								}}
							/>

							{editState.index !== i && (
								<InputGroup.Text>
									<Form.Switch
										type="switch"
										size="sm"
										checked={!secret.isPrivate}
										disabled={fetchState === i}
										onChange={(e) => changeSecretState(i, !e.target.checked)}
									/>
								</InputGroup.Text>
							)}

							<Button
								variant={editState.index === i ? 'primary' : 'warning'}
								className="react-icons-wrapper"
								disabled={fetchState === i}
								onClick={() => (editState.index === i ? saveEditedSecret() : editSecret(i))}>
								{editState.index === i ? (
									<BsCheckLg className="react-icons" />
								) : (
									<BsPencilFill className="react-icons" />
								)}
							</Button>

							<Button
								variant="danger"
								className="react-icons-wrapper"
								disabled={fetchState === i}
								onClick={() => (editState.index === i ? cancelEditSecret() : deleteSecret(i))}>
								{editState.index === i ? (
									<ImCancelCircle className="react-icons" />
								) : (
									<FaTrash className="react-icons" />
								)}
							</Button>
						</InputGroup>
					))
				) : user?.id ? (
					<p className="secret-text">You didn't submit any secret yet.</p>
				) : (
					<ButtonLoader variant="dark m-3" size="lg" />
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

				{fetchState === -2 ? (
					<ButtonLoader variant="dark m-3" size="sm" />
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
