import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import Context from '../../Context';
import { Spinner, Form, Button, FloatingLabel, Stack, InputGroup } from 'react-bootstrap';
import axios from 'axios';
import date from 'date-and-time';
import { toast } from 'react-toastify';

import ButtonLoader from '../../components/ButtonLoader';

import './AdminPanel.scss';

export default function AdminPanel() {
	const { toastUpdate } = useContext(Context);

	const [data, setData] = useState({
		fetching: false,
		password: '',
		isAuthorized: false,
		feedback: [],
		fetchDelete: 0,
	});

	const handleLoginSubmit = (e) => {
		e.preventDefault();
		fetchData();
	};

	const fetchData = (deleteId = 0) => {
		setData((prev) => ({ ...prev, fetching: true, fetchDelete: deleteId }));
		const password = data.password;

		const toastId = toast.loading(deleteId ? 'Deleting feedback...' : 'Loading...');
		const axiosMethod = deleteId ? axios.delete : axios.post;

		axiosMethod(`${process.env.REACT_APP_WEB_URL}/admin/feedback`, { data: { password, deleteId } })
			.then((res) => {
				if (res.status === 200) {
					toastUpdate(
						toastId,
						'success',
						deleteId ? 'Feedback deleted successfully.' : 'Authorized successfully.'
					);
					setData((prev) => ({
						...prev,
						fetching: true,
						fetchDelete: 0,
						isAuthorized: true,
						feedback: deleteId ? data.feedback.filter((v) => v._id !== deleteId) : res.data.feedback,
					}));
				} else {
					toastUpdate(toastId, 'error', 'ERROR: Unable to authorized.');
					setData((prev) => ({ ...prev, fetching: false, fetchDelete: 0 }));
				}
			})
			.catch((err) => {
				setData((prev) => ({ ...prev, fetching: false, fetchDelete: 0 }));
				toastUpdate(toastId, 'error', err);
				console.log(err);
			});
	};

	const handleFeedbackDelete = (id) => window.confirm('Are you sure you want delete the feedback?') && fetchData(id);

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
								<ButtonLoader variant="danger" size="sm" />
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
						<h3 className="display-5">User feedback:</h3>
						{data?.feedback?.map((feedback) => (
							<InputGroup key={feedback._id} className="mb-3">
								<InputGroup.Text>
									{date.format(new Date(feedback.date), 'DD/M/YY HH:mm')}
									{(feedback.name?.first || feedback.name?.last) && (
										<>
											<br />
											{feedback.name?.first} {feedback.name?.last}
										</>
									)}{' '}
									[{feedback.range}%]
								</InputGroup.Text>
								<Form.Control as="textarea" minrows="1" value={feedback.comments} disabled />
								{data.fetchDelete === feedback._id ? (
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
