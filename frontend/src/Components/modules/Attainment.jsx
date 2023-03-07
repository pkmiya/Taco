import React, { useEffect, useState } from 'react'
import { auth } from "../../firebase";
import axios from "./axios";
import {
	Box,
	CircularProgress,
	List,
	ListItem,
	IconButton,
	ListItemText,
	Typography,
} from '@mui/material';
import KeyboardReturnIcon from '@mui/icons-material/KeyboardReturn';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
function Attainment() {

	const [dones, setDones] = useState([]);
	const [shareDones, setShareDones] = useState([]);
	const [isLoading, setIsLoading] = useState(true);


	useEffect(() => {
		const accessToken = auth.currentUser.accessToken;

		const fetchPrivateDones = async () => {

			const response = await axios.get(`/todo/dones`, {
				headers: { Authorization: accessToken }
			})
			const body = await response.data;
			setDones(body);
			setIsLoading(false);
		}

		const fetchShareDones = async () => {
			const response = await axios.get('/sharetodos/dones', {
				headers: { Authorization: accessToken }
			})
			const body = await response.data;
			setShareDones(body);
		}



		fetchPrivateDones();
		fetchShareDones();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const returnPrivateButtonClick = async (doneId) => {
		const accessToken = auth.currentUser.accessToken;
		await axios.put(`/todo/dones`, {
			headers: { Authorization: accessToken },
			id: doneId
		}).then(
			(res) => setDones(res.data)
		);
	}

	const deletePrivateButtonClick = async (doneId) => {
		const accessToken = auth.currentUser.accessToken;

		await axios.delete(`/todo/dones`, {
			data: {
				headers: { Authorization: accessToken },
				id: doneId
			}
		}).then(
			(res) => setDones(res.data)
		);
	}

	// shareの処理
	const returnShareButtonClick = async (shareDoneId) => {
		const accessToken = auth.currentUser.accessToken;
		await axios.put(`/sharetodos/dones`, {
			headers: { Authorization: accessToken },
			id: shareDoneId
		}).then(
			(res) => setShareDones(res.data)
		);
	}

	const changeDate = (updated_at) => {
		const date = new Date(updated_at);
		const dateString = date.toLocaleDateString();
		return `Todo終了日 : ${dateString}`;

	}

	// const searchTeam = (teamId) => {
	// 	const teamName = teams.filter(team => {
	// 		return team.id === teamId;
	// 	})
	// 	return teamName[0].name
	// }

	return (
		<div>
			{
				isLoading === true ? (
					<Box sx={{ position: 'absolute', top: '45%', left: '40%' }}>
						<CircularProgress size={70} />
					</Box>
				) : (

					dones.length === 0 && shareDones.length === 0 ? (
						<React.Fragment >
							<Typography variant='h5' align = "center" sx={{fontWeight:'bold', mt:'30%'}} >
								{"進捗を作りましょう🤞"}
							</Typography>
							
						</React.Fragment>
					) : (
						<React.Fragment>
							{
								dones.map((done, i) => {
									return (
										<List key={i}>
											<ListItem >
												<IconButton onClick={() => returnPrivateButtonClick(done['id'])} >
													<KeyboardReturnIcon />
												</IconButton>
												<ListItemText primary={done.content} secondary={changeDate(done['updated_at'])} />
												<IconButton onClick={() => deletePrivateButtonClick(done['id'])}>
													<DeleteForeverIcon />
												</IconButton>
											</ListItem>
										</List >
									)
								})
							}
							{
								shareDones.map((sharedone, j) => {
									return (
										<List key={sharedone.id}>
											<ListItem divider>
												<IconButton onClick={() => returnShareButtonClick(sharedone['id'])} >
													<KeyboardReturnIcon />
												</IconButton>
												<ListItemText primary={sharedone.content} secondary={changeDate(sharedone['updated_at'])} />
												<ListItemText primary={sharedone['name']} />
											</ListItem>
										</List >
									)
								})
							}
						</React.Fragment>
					)

				)
			}
		</div >
	)
}

export default Attainment