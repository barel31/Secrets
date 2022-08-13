import React from 'react';
import { Card, Button } from 'react-bootstrap';

export default function SocialCard() {
	return (
		<Card>
			<Card.Body>
				<Button
					variant="block btn-social btn-google"
					onClick={() => window.open(`${process.env.REACT_APP_WEB_URL}/auth/google`, '_self')}>
					<i className="fab fa-google" />
					Sign In with Google
				</Button>
			</Card.Body>

			<Card.Body>
				<Button
					variant="block btn-social btn-facebook"
					onClick={() => window.open(`${process.env.REACT_APP_WEB_URL}/auth/facebook`, '_self')}>
					<i className="fab fa-facebook" />
					Sign In with Facebook
				</Button>
			</Card.Body>
		</Card>
	);
}
