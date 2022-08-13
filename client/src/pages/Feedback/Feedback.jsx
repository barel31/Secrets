import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import Context from '../../Context';
import { Form, Button, Col, Row, FloatingLabel } from 'react-bootstrap';
import axios from 'axios';
import { toast } from 'react-toastify';

import ButtonLoader from '../../components/ButtonLoader';

import './Feedback.scss';

export default function Feedback() {
	const { toastUpdate } = useContext(Context);

	const [fetching, setFetching] = useState(false);

	const formRangeChange = (e) => {
		const rangeV = document.getElementById('rangeV');
		const value = e.target.value;
		const newPosition = 10 - value * 0.18;

		rangeV.innerHTML = `<span>${value}</span>`;
		rangeV.style.left = `calc(${value}% + (${newPosition}px))`;
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		setFetching(true);
		const toastId = toast.loading('Sending feedback...');

		axios
			.post(`${process.env.REACT_APP_WEB_URL}/api/feedback`, {
				firstName: e.target.firstName.value,
				lastName: e.target.lastName.value,
				range: e.target.range.value,
				comments: e.target.comments.value,
			})
			.then((res) => {
				if (res.status === 200) {
					setFetching(-1);
					toastUpdate(toastId, 'success', 'Send successfully. Thank you for your feedback!');
				} else {
					setFetching(false);
					toastUpdate(toastId, 'error', 'ERROR: Unable send feedback.');
					throw new Error('Unable send feedback.');
				}
			})
			.catch((err) => {
				console.log(err);
				toastUpdate(toastId, 'error', 'ERROR: Unable send feedback.');
				setFetching(false);
			});
	};

	return (
		<div className="Feedback">
			<h1 className="display-1">Feedback</h1>

			<div className="feedback-container">
				{fetching === -1 ? (
					<h3 className="display-3 text-center">Thank you for your feedback!</h3>
				) : (
					<Col>
						<Form onSubmit={handleSubmit}>
							<Row lg="2">
								<FloatingLabel
									label="First name"
									controlId="feedback-firstname"
									className="feedback-floating-left mb-3">
									<Form.Control placeholder="First name" name="firstName" />
								</FloatingLabel>
								<FloatingLabel
									label="Last name"
									controlId="feedback-lastname"
									className="feedback-floating-left mb-3">
									<Form.Control placeholder="Last name" name="lastName" />
								</FloatingLabel>
							</Row>

							<Form.Label>Overlall experience:</Form.Label>
							<div className="range-wrap mb-3">
								<Form.Range onChange={formRangeChange} id="feedback-range" name="range" />
								<div className="range-value" id="rangeV" />
								<div className="d-flex justify-content-between font-weight-bold">
									<span>0</span>
									<span>100</span>
								</div>
							</div>

							<FloatingLabel label="Comments" className="mb-3" controlId="feedback-textarea">
								<Form.Control
									as="textarea"
									placeholder="Leave a comment here"
									maxLength="2000"
									name="comments"
									required
								/>
							</FloatingLabel>

							{fetching ? (
								<ButtonLoader />
							) : (
								<Button variant="primary" type="submit">
									Send
								</Button>
							)}
						</Form>
					</Col>
				)}
			</div>

			<Link to="/" className="btn btn-dark m-3">
				HOME
			</Link>
		</div>
	);
}
