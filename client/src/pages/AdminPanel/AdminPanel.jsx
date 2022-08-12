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

	const [data, setData] = useState({ fetching: false, password: '', isAuthorized: false, feedbacks: [] });

	useEffect(() => {
		if (data.password.length) {
			setData((prev) => ({ ...prev, fetching: true }));

			axios(`${process.env.REACT_APP_WEB_URL}/api/feedback`, { password: data.password })
				.then((res) => {
					setData((prev) => ({ ...prev, fetching: false }));

					if (res.status === 200) {
					} else {
					}
				})
				.catch((err) => {
					setData((prev) => ({ ...prev, fetching: false }));
					console.log(err);
				});
		}
	}, []);

	return (
		<div className="Admin jumbotron">
			<div className="jumbotron text-center">
				<div className="container">
					<i className="fas fa-key fa-6x" />
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
						<></>
					)}

					<Link to="/" className="btn btn-dark m-3">
						HOME
					</Link>
				</div>
			</div>
		</div>
	);
}
