import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

export default function CbGoogle() {
	const nav = useNavigate();

	useEffect(() => {
		toast.success('Succesfully logged in with Google account.');
		nav('/secrets');
	}, []);

	return <>redirect...</>;
}
