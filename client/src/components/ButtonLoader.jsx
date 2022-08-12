import React from 'react';
import { Spinner, Button } from 'react-bootstrap';

export default function ButtonLoader() {
	return (
		<Button variant="danger" disabled>
			<Spinner as="span" animation="border" size="lg" role="status" aria-hidden="true" />
			<span className="visually-hidden">Loading...</span>
		</Button>
	);
}
