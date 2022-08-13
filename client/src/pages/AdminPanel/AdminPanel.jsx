import React, { useEffect, useState, useContext, useRef } from 'react';
import { Link } from 'react-router-dom';
import Context from '../../Context';
import { Spinner, Form, Button, Col, Row, FloatingLabel, Stack, InputGroup } from 'react-bootstrap';
import axios from 'axios';
import date from 'date-and-time';
import { toast } from 'react-toastify';

import ButtonLoader from '../../components/ButtonLoader';

import './AdminPanel.scss';

export default function AdminPanel() {
	const { toastUpdate } = useContext(Context);

	const [data, setData] = useState({ fetching: false, password: '', isAuthorized: false, feedback: [] });

	const fetchState = { switch: null, button: null };

	const handleLoginSubmit = (e) => {
		e.preventDefault();

		setData((prev) => ({ ...prev, fetching: true }));
		const toastId = toast.loading('Loading...');

		const password = e.target.password.value;
		axios
			.post(`${process.env.REACT_APP_WEB_URL}/admin/feedback`, { password })
			.then((res) => {
				if (res.status === 200) {
					toastUpdate(toastId, 'success', 'Successfully authorized.');
					setData((prev) => ({
						...prev,
						fetching: true,
						isAuthorized: true,
						feedback: res.data.feedback,
					}));
					console.log(res.data.feedback);
				} else {
					// setData((prev) => ({ ...prev, fetching: false }));
					// toastUpdate(toastId, 'error', 'ERROR: Unable to authorized.');
					throw 'ERROR: Unable to authorized';
				}
			})
			.catch((err) => {
				setData((prev) => ({ ...prev, fetching: false }));
				toastUpdate(toastId, 'error', 'ERROR: Unable to authorized.');
				console.log(err);
			});
	};

	const handleFeedbackDelete = (id) => {
		if (!window.confirm('Are you sure you want delete the feedback?')) return;
		console.log(id);
	};

	return (
		<div className="Admin">
			<h1 className="display-1">Admin Panel</h1>

			{!data.isAuthorized ? (
				<>
					<Form onSubmit={handleLoginSubmit}>
						<Stack gap={2} className="admin-panel-container col-md-5 mx-auto">
							<FloatingLabel label="Password" controlId="admin-panel-passowrd">
								<Form.Control
									type="password"
									name="password"
									placeholder="Password"
									onChange={(e) => setData((prev) => ({ ...prev, password: e.target.value }))}
									required
								/>
							</FloatingLabel>

							{data.fetching ? (
								<ButtonLoader />
							) : (
								<Button variant="primary" type="submit">
									Enter
								</Button>
							)}
						</Stack>
					</Form>
				</>
			) : (
				<>
					<div className="container d-flex flex-column justify-content-center flex-wrap w-100">
						<h3 className="display-5">IN PROGRESS</h3>
						{data.feedback.map((feedback, i) => (
							<InputGroup key={feedback._id} className="mb-3">
								<InputGroup.Text>
									{date.format(new Date(feedback.date), 'DD/M/YY HH:mm')}
									{(feedback.name?.first || feedback.name?.last) && (
										<>
											<br />
											{feedback.name?.first} {feedback.name?.last}
										</>
									)}
								</InputGroup.Text>
								<Form.Control as="textarea" minrows="1" value={feedback.comments} disabled />
								{fetchState.button === i ? (
									<Button variant="danger" disabled>
										<Spinner
											as="span"
											animation="border"
											size="lg"
											role="status"
											aria-hidden="true"
										/>
										<span className="visually-hidden">Loading...</span>
									</Button>
								) : (
									<Button
										variant="danger"
										size="sm"
										onClick={() => handleFeedbackDelete(feedback._id)}>
										Delete
									</Button>
								)}
							</InputGroup>
						))}
					</div>
				</>
			)}

			<Link to="/" className="btn btn-dark m-3">
				HOME
			</Link>
		</div>
	);
}
