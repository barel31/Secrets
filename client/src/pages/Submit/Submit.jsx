import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Context from '../../Context';
import { Button, Form } from 'react-bootstrap';
import { toast } from 'react-toastify';

import SecretManage from '../../components/SecretManage/SecretManage';

import './Submit.scss';
import ButtonLoader from '../../components/ButtonLoader';

export default function Submit() {
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
						<SecretManage
							secret={secret}
							editState={editState}
							fetchState={fetchState}
							setEditState={setEditState}
							setFetchState={setFetchState}
							i={i}
						/>
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
