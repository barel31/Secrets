import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

export default function CallBack() {
	const nav = useNavigate();

	useEffect(() => {
		const path = window.location.href;
		if (path.includes('/callback/google/success')) {
			toast.success('Succesfully logged in with Google account.');
		} else if (path.includes('/callback/facebook/success')) {
			toast.success('Succesfully logged in with Facebook account.');
		}

		if (path.includes('/callback/login/failed')) {
			toast.error('Login was failed.');
			nav('/login');
		} else nav('/secrets');
		// eslint-disable-next-line
	}, []);

	return <>redirect...</>;
}
