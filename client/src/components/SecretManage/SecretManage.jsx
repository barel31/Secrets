import React, {useContext} from 'react';
import axios from 'axios';
import Context from '../../Context';
import date from 'date-and-time';
import { Button, Form, InputGroup } from 'react-bootstrap';
import { toast } from 'react-toastify';

import { FaTrash } from 'react-icons/fa';
import { BsPencilFill, BsCheckLg } from 'react-icons/bs';
import { ImCancelCircle } from 'react-icons/im';

function SecretManage({ secret, editState, setEditState, setFetchState, fetchState, i }) {
	const { user, toastUpdate } = useContext(Context);

	const deleteSecret = (secretIndex) => {
		if (!window.confirm('Are you sure you want delete your secret?')) return;

		setFetchState(secretIndex);
		const toastId = toast.loading('Deleting secret...');

		axios
			.delete(`${process.env.REACT_APP_WEB_URL}/api/user/secrets`, { secretIndex })
			.then((res) => {
				setFetchState(-1);

				if (res.status === 200) {
					toastUpdate(toastId, 'success', 'Secret deleted successfully!');
					user.secrets.splice(secretIndex, 1);
				} else {
					toastUpdate(toastId, 'error', 'ERROR: Cannot delete secret.');
					// throw new Error('Cannot delete secret.');
				}
			})
			.catch((err) => {
				setFetchState(-1);
				toastUpdate(toastId, 'error', err);
				console.log(err);
			});
	};

	const editSecret = (secretIndex) => {
		const secretText = user.secrets[secretIndex].secret;
		setEditState(() => ({ index: secretIndex, text: secretText }));

		const editedElement = document.getElementById(`secret-list-${secretIndex}`);
		editedElement.value = secretText;
		setTimeout(() => editedElement.focus(), 0);
	};

	const saveEditedSecret = () => {
		const secretIndex = editState.index;
		setFetchState(secretIndex);
		const toastId = toast.loading('Editing secret...');

		axios
			.patch(`${process.env.REACT_APP_WEB_URL}/api/user/secrets`, { secretIndex, secretText: editState.text })
			.then((res) => {
				setFetchState(-1);
				setEditState(() => ({ index: -1, text: '' }));

				if (res.status === 200) {
					toastUpdate(toastId, 'success', 'Secret updated successfully!');
					user.secrets[secretIndex].secret = editState.text;
				} else {
					toastUpdate(toastId, 'error', 'ERROR: Cannot edit secret.');
					throw new Error('Cannot edit secret.');
				}
			})
			.catch((err) => {
				setFetchState(-1);
				setEditState(() => ({ index: -1, text: '' }));
				toastUpdate(toastId, 'error', 'ERROR: Cannot edit secret.');
				console.log(err);
			});
	};

	const cancelEditSecret = () => {
		document.getElementById(`secret-list-${editState.index}`).value = '';
		setEditState(() => ({ index: -1, text: '' }));
	};

	const changeSecretState = (secretIndex, isPrivate) => {
		setFetchState(secretIndex);
		const toastId = toast.loading('Updating secret...');

		axios
			.patch(`${process.env.REACT_APP_WEB_URL}/api/user/secrets`, { secretIndex, isPrivate })
			.then((res) => {
				setFetchState(-1);

				if (res.status === 200) {
					toastUpdate(toastId, 'success', 'Secret state updated successfully!');
					user.secrets[secretIndex].isPrivate = isPrivate;
				} else {
					toastUpdate(toastId, 'error', 'ERROR: Cannot change secret state.');
					throw new Error('Cannot change secret state.');
				}
			})
			.catch((err) => {
				toastUpdate(toastId, 'error', 'ERROR: Cannot change secret state.');
				setFetchState(-1);
				console.log(err);
			});
	};

	return (
		<div>
			<InputGroup className="secret-list-item mb-3">
				<InputGroup.Text className="secret-list-item-date">
					{date.format(new Date(secret.date), 'DD/M/YY HH:mm')}
				</InputGroup.Text>

				<Form.Control
					placeholder={secret.secret}
					aria-label={secret.secret}
					aria-describedby={secret.secret}
					disabled={editState.index !== i}
					className="secret-list-item-secret"
					id={`secret-list-${i}`}
					onChange={(e) =>
						editState.index === i && setEditState((prev) => ({ ...prev, text: e.target.value }))
					}
					onKeyDown={(e) => {
						if (editState.index === i) {
							if (e.key === 'Enter') saveEditedSecret();
							else if (e.key === 'Escape') cancelEditSecret();
						}
					}}
				/>

				<InputGroup.Text className="secret-list-item-actions">
					{editState.index !== i && (
						<Form.Switch
							type="switch"
							size="sm"
							checked={!secret.isPrivate}
							disabled={fetchState === i}
							onChange={(e) => changeSecretState(i, !e.target.checked)}
						/>
					)}

					<Button
						title="Edit"
						variant={editState.index === i ? 'primary' : 'warning'}
						className="react-icons-wrapper"
						disabled={fetchState === i}
						onClick={() => (editState.index === i ? saveEditedSecret() : editSecret(i))}>
						{editState.index === i ? (
							<BsCheckLg className="react-icons" />
						) : (
							<BsPencilFill className="react-icons" />
						)}
					</Button>

					<Button
						title="Delete"
						variant="danger"
						className="react-icons-wrapper"
						disabled={fetchState === i}
						onClick={() => (editState.index === i ? cancelEditSecret() : deleteSecret(i))}>
						{editState.index === i ? (
							<ImCancelCircle className="react-icons" />
						) : (
							<FaTrash className="react-icons" />
						)}
					</Button>
				</InputGroup.Text>
			</InputGroup>
		</div>
	);
}

export default SecretManage;
