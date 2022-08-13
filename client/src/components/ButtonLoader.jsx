import React from 'react';
import { Spinner, Button } from 'react-bootstrap';

export default function ButtonLoader({variant, size}) {
	return (
		<Button variant={variant} disabled>
			<Spinner as="span" animation="border" size={size} role="status" aria-hidden="true" />
			<span className="visually-hidden">Loading...</span>
		</Button>
	);
}
