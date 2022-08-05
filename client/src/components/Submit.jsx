import React, { useEffect, useState, useContext, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Context from '../Context';
import { Button, Form, InputGroup } from 'react-bootstrap';

export default function Submit() {
	const nav = useNavigate();

	const [userSecrets, setUserSecrets] = useState([]);

	const { user, toast, fetched } = useContext(Context);

	const secretInput = useRef();

	const fetchData = () => {
		axios
			.post(`${process.env.REACT_APP_WEB_URL}/api/user/secrets`)
			.then((res) => {
				if (res.status === 200) {
					setUserSecrets(res.data.secrets);
				} else {
					toast.error('ERROR: User authentication has been failed!');
					throw new Error('authentication has been failed!');
				}
			})
			.catch((err) => console.log(err));
	};

	useEffect(() => {
		fetchData();
	}, [user]);

	useEffect(() => {
		if (fetched && !user) {
			toast.warn("You're not logged in. Redirect to login page.");
			nav('/login');
		}
	}, [fetched]);

	const deleteSecret = (secretIndex) => {
		axios
			.post(`${process.env.REACT_APP_WEB_URL}/api/user/delete`, { secretIndex })
			.then((res) => {
				if (res.status === 200) {
					fetchData();
					toast.success('Secret deleted successfully!');
				} else {
					toast.error('ERROR: Cannot delete secret.');
					throw new Error('Cannot delete secret.');
				}
			})
			.catch((err) => {
				toast.error('ERROR: Cannot delete secret.');
				console.log(err);
			});
	};

	const onFormSubmit = (e) => {
		e.preventDefault();

		const secret = secretInput.current.value;
		axios
			.post(`${process.env.REACT_APP_WEB_URL}/api/submit`, { secret })
			.then((res) => {
				if (res.status === 200) {
					fetchData();
					toast.success(`Successfully created new secret: ${secret}`);
					secretInput.current.value = '';
				} else {
					toast.error(`Cannot add secret`);
					throw new Error('Cannot add secret.');
				}
			})
			.catch((err) => {
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
					{userSecrets ? (
						userSecrets.map((secret, i) => (
							<InputGroup key={i} className="mb-3">
								<Form.Control
									placeholder={secret}
									aria-label={secret}
									aria-describedby={secret}
									disabled
								/>
								<Button variant="btn btn-danger" id="button-addon2" onClick={deleteSecret}>
									Delete
								</Button>
							</InputGroup>
						))
					) : (
						<p>You haven't submit any secret yet.</p>
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
					<button type="submit" className="btn btn-dark">
						Submit
					</button>
				</form>
			</div>
		</div>
	);
}
