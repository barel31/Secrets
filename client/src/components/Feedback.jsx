import React, { useState, useContext, useRef } from 'react';
import { Link } from 'react-router-dom';
import Context from '../Context';
import { Spinner, Form, Button, Col, Row, FloatingLabel } from 'react-bootstrap';
import axios from 'axios';
import { toast } from 'react-toastify';

export default function Feedback() {
	const { toastUpdate } = useContext(Context);

	const [formRange, setFormRange] = useState(50);
	const [fetching, setFetching] = useState(false);

	const feedbackFormRef = { firstName: useRef(), lastName: useRef(), comments: useRef() };

	const formRangeChange = (e) => {
		setFormRange(e.target.value);

		const rangeV = document.getElementById('rangeV');
		const value = e.target.value;
		const newPosition = 10 - value * 0.2;

		rangeV.innerHTML = `<span>${value}</span>`;
		rangeV.style.left = `calc(${value}% + (${newPosition}px))`;
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		setFetching(true);
		const toastId = toast.loading('Sending feedback...');

		axios
			.post(`${process.env.REACT_APP_WEB_URL}/api/feedback`, {
				firstName: feedbackFormRef.firstName.current.value,
				lastName: feedbackFormRef.lastName.current.value,
				range: formRange,
				comments: feedbackFormRef.comments.current.value,
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
		<div className="Feedback jumbotron centered">
			<div className="jumbotron text-center">
				<div className="container">
					<i className="fas fa-key fa-6x" />
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
											<Form.Control
												placeholder="First name"
												ref={feedbackFormRef.firstName}
												required
											/>
										</FloatingLabel>
										<FloatingLabel
											label="Last name"
											controlId="feedback-lastname"
											className="feedback-floating-left mb-3">
											<Form.Control
												placeholder="Last name"
												ref={feedbackFormRef.lastName}
												required
											/>
										</FloatingLabel>
									</Row>

									<Form.Label>Overlall experience:</Form.Label>
									<div className="range-wrap mb-3">
										<Form.Range onChange={formRangeChange} id="feedback-range" />
										<div className="range-value" id="rangeV"></div>
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
											required
											ref={feedbackFormRef.comments}
										/>
									</FloatingLabel>

									{fetching ? (
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
			</div>
		</div>
	);
}
