import React, { useEffect, useState, useContext, useRef } from 'react';
import { Link } from 'react-router-dom';
import Context from '../../Context';
import { Spinner, Form, Button, Col, Row, FloatingLabel, Stack } from 'react-bootstrap';
import axios from 'axios';
import { toast } from 'react-toastify';

import ButtonLoader from '../../components/ButtonLoader';

import './AdminPanel.scss';

export default function AdminPanel() {
	const { toastUpdate } = useContext(Context);

	const [data, setData] = useState({ fetching: false, password: '', isAuthorized: false, feedback: [] });

	useEffect(() => {
		if (data.password.length) {
			setData((prev) => ({ ...prev, fetching: true }));

			axios(`${process.env.REACT_APP_WEB_URL}/api/feedback`, { password: data.password })
				.then((res) => {
					setData((prev) => ({ ...prev, fetching: false }));

					if (res.status === 200) {
						setData((prev) => ({
							...prev,
							fetching: true,
							isAuthorized: true,
							feedback: res.data.feedback,
						}));
					} else {
					}
				})
				.catch((err) => {
					setData((prev) => ({ ...prev, fetching: false }));
					console.log(err);
				});
		}
		// eslint-disable-next-line
	}, []);

	return (
		<div className="Admin">
			<h1 className="display-1">Admin Panel</h1>

			{!data.isAuthorized ? (
				<>
					<Form>
						<Stack gap={2} className="admin-panel-container col-md-5 mx-auto">
							<FloatingLabel label="Password" controlId="admin-panel-passowrd">
								<Form.Control
									placeholder="First name"
									onChange={(e) => setData((prev) => ({ ...prev, password: e.target.value }))}
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
					<h3 className="display-5">IN PROGRESS</h3>
				</>
			)}

			<Link to="/" className="btn btn-dark m-3">
				HOME
			</Link>
		</div>
	);
}
