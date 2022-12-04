import { useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Context from '../../Context';
import axios from 'axios';
import { toast } from 'react-toastify';

export default function Logout({ redirectUrl }) {
	const nav = useNavigate();

	const { user, fetchData } = useContext(Context);

	useEffect(() => {
		if (user?.id) {
			axios(`${process.env.REACT_APP_WEB_URL}/auth/logout`)
				.then((res) => {
					if (res.status === 200) {
						if (res.data.success) {
							fetchData();
							nav(redirectUrl || '/');
							toast.success('Logout successfully.');
						} else toast.error('Cannot logout.');
					} else {
						toast.error('Error accured when trying to logout.');
						throw new Error('Error accured when trying to logout.');
					}
				})
				.catch((err) => console.log(err));
		} else nav('/login');
		// eslint-disable-next-line
	}, []);
}
