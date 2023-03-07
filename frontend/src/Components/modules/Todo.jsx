import React, { useState, useEffect } from "react";
import axios from "./axios";
import {
	Badge,
	CircularProgress,
	List,
	ListItem,
	styled,
	Typography,
	Box,
	ListItemText,
	Dialog,
	DialogActions,
	DialogTitle,
	DialogContent,
	DialogContentText,
	Button,
	IconButton,
	Alert,
	AlertTitle,
	Snackbar,
	Menu,
    MenuItem
} from "@mui/material";
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import EditDialog from "./EditDialog";
import MuiAccordion from "@mui/material/Accordion";
import MuiAccordionSummary from "@mui/material/AccordionSummary";
import ArrowForwardIosSharpIcon from "@mui/icons-material/ArrowForwardIosSharp";
import MuiAccordionDetails from "@mui/material/AccordionDetails";
import { auth } from "../../firebase";
import AssignmentIcon from '@mui/icons-material/Assignment';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CloseIcon from '@mui/icons-material/Close';
import GroupsIcon from '@mui/icons-material/Groups';
import PersonIcon from '@mui/icons-material/Person';
import PrivateEditMenu from './PrivateEditMenu';

// import { useAuthContext } from "../../context/AuthContext";

const Accordion = styled((props) => (
	<MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
	border: `1px solid ${theme.palette.divider}`,
	"&:not(:last-child)": {
		borderBottom: 0,
	},
	"&:before": {
		display: "none",
	},
}));

const AccordionSummary = styled((props) => (
	<MuiAccordionSummary
		expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: "0.9rem" }} />}
		{...props}
	/>
))(({ theme }) => ({
	backgroundColor:
		theme.palette.mode === "dark"
			? "rgba(255, 255, 255, .05)"
			: "rgba(0, 0, 0, .03)",
	flexDirection: "row-reverse",
	"& .MuiAccordionSummary-expandIconWrapper.Mui-expanded": {
		transform: "rotate(90deg)",
	},
	"& .MuiAccordionSummary-content": {
		marginLeft: theme.spacing(1),
	},
}));

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
	// padding: theme.spacing(2),
	borderTop: "1px solid rgba(0, 0, 0, .125)",
}));

const style = {
	width: '100%',
	maxwidth: 360,
	bgcolor: 'background.paper'
}

const EditMenu = (props) => {
    const { editDialogShow, menuButtonClick, confirmDialog } = props;
    const [anchorEl, setAnchorEl] = useState(null);
    const isEditMenuOpend = Boolean(anchorEl);
    const editMenuClose = () => {
        setAnchorEl(null);
    }

    const shareTodoDelete = () => {
        confirmDialog();
        // deleteButtonClicked(shareTodoId)
        setAnchorEl(null);
    }

    const editButtonClick = (event) => {
        setAnchorEl(event.currentTarget);
        menuButtonClick();
        // onClick(shareTodoContent)
    }

    return (
        <React.Fragment>

            <IconButton
                onClick={editButtonClick}
                aria-controls={isEditMenuOpend ? 'basic-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={isEditMenuOpend ? 'true' : undefined}
                edge="end"
            >
                <MoreHorizIcon />
            </IconButton>
            <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={isEditMenuOpend}
                onClose={editMenuClose}
                MenuListProps={{
                    'aria-labelledby': 'basic-button',
                }}
            >
                <MenuItem onClick={() => { editDialogShow(); setAnchorEl(null) }}>
                    編集
                </MenuItem>

                <MenuItem onClick={() => shareTodoDelete()}>
                    削除
                </MenuItem>

            </Menu>
        </React.Fragment >
    )
}


const Todo = () => {
	const [expanded, setExpanded] = useState();
	const handleChange = (panel) => (event, newExpanded) => {
		setExpanded(newExpanded ? panel : false);
	};
	const [editOpen, setEditOpen] = useState({ "is_open": false, "id": 0, "team_id": 0, "content": "", "memo": "", "deadline": new Date() });
	const [isLoading, setIsLoading] = useState(true);
	const [todos, setTodos] = useState([]);
	// const [teamIds, setTeamIds] = useState([]);
	const [teams, setTeams] = useState([]);
	const [shareTodos, setShareTodos] = useState([]);
	const [shareBadges, setShareBadges] = useState([]);
	const [alert, setAlert] = useState(false);
	const [open, setOpen] = useState({ "is_open": false, "todoId": "", "todoContent": "" });
	const [shareOpen, setShareOpen] = useState({ "is_open": false, "todoId": "", "todoContent": "" });
	const [menuOpen, setMenuOpen] = useState({ "team": 0, "content": "", "memo": "", "deadline": new Date() });


	useEffect(() => {
		const accessToken = auth.currentUser.accessToken;
		const fetchPrivateTodos = async () => {
			const response = await axios.get(`/todos`, {
				headers: { Authorization: accessToken }
			})
			const body = await response.data;
			setTodos(body);
		}

		// const fetchTeamIds = async () => {
		// 	const response = await axios.get(`/members`, {
		// 		headers: {Authorization: accessToken }
		// 	})
		// 	const body = await response.data;
		// 	setTeamIds(body);
		// }

		const fetchTeams = async () => {
			const response = await axios.get(`/teams`, {
				headers: { Authorization: accessToken }
			})
			const body = await response.data;
			setTeams(body);
		}

		const fetchShareTodos = async () => {
			const response = await axios.get(`/sharetodos`, {
				headers: { Authorization: accessToken }
			})
			const body = await response.data;
			setShareTodos(body);
		}

		const fetchShareBadges = async () => {
			const response = await axios.get(`/sharetodos/badges`, {
				headers: { Authorization: accessToken }
			})
			const body = await response.data;
			setShareBadges(body);
			setIsLoading(false);
		}

		fetchPrivateTodos();
		fetchShareTodos();
		fetchTeams();
		// fetchTeamIds();
		fetchShareBadges();

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const getShareBadges = (teamId) => {
		const shareBadge = shareBadges.find((shareBadge) => shareBadge.team_id === teamId);
		if (shareBadge) {
			return shareBadge['COUNT(todos_shared.team_id)'];
		}
		return 0;
	}

	const changeDate = (deadLineDate) => {
		const date = new Date(deadLineDate);
		const dateString = date.toLocaleDateString();
		return dateString;
	}


	const handleClose = () => {
		setOpen({ "is_open": false, "todoId": "", "todoContent": "" });
		setShareOpen({ "is_open": false, "todoId": "", "todoContent": "" });
	}

	const handleClick = () => {
		setOpen({ "is_open": false, "todoId": "", "todoContent": "" });
		setShareOpen({ "is_open": false, "todoId": "", "todoContent": "" });
	}

	const handleAgreeClick = () => {
		const accessToken = auth.currentUser.accessToken;
		const todoPrivateIsDone = async (todoId) => {
			await axios.put(`/todos/isdone`, {
				headers: { Authorization: accessToken },
				id: todoId
			}).then(
				(res) => setTodos(res.data)
			);
		}
		todoPrivateIsDone(open['todoId']);
		setOpen({ "is_open": false })
		setAlert(true)
	}

	const shareTodoAgreeClicked = () => {
		const accessToken = auth.currentUser.accessToken;
		const todoSharedIsDone = async (todoId) => {
			await axios.put(`/sharetodos/isdone`, {
				headers: { Authorization: accessToken },
				id: todoId
			}).then(
				(res) => setShareTodos(res.data)
			);
		}
		todoSharedIsDone(shareOpen['todoId']);
		setShareOpen({ "is_open": false })
		setAlert(true)
	}

	const errorHandleClose = (event, reason) => {
		if (reason === 'clickaway') {
			return;
		}
		setAlert(false);
	};

	const doneButtonClicked = (todoId, todoContent) => {
		setOpen({ "is_open": true, "todoId": todoId, "todoContent": todoContent });
	}


	const shareDoneButtonClicked = (shareTodoId, shareTodoContent) => {
		setShareOpen({ "is_open": true, "todoId": shareTodoId, "todoContent": shareTodoContent });
	}
	const deleteButtonClick = (shareTodoId) => {
		const accessToken = auth.currentUser.accessToken;
		const deleteTodo = async () => {
			await axios.delete('/sharetodos', {
				data: {
					headers: { Authorization: accessToken },
					id: shareTodoId
				}
			}).then((res) => setShareTodos(res.data));
		}
		deleteTodo();
		setFinalConfirm(false);
		console.log(shareTodoId)
	}

	const editDialogClose = () => {
		setEditOpen({ "is_open": false });
	};

	const [teamName, setTeamName] = useState('');

	const menuButtonClick = (id, teamId, content, memo, deadline) => {
		setMenuOpen({ "id": id, "team": teamId, "content": content, "memo": memo, "deadline": deadline });
		let selectTeam = teams.filter(team => Number(team['id']) === Number(menuOpen['team']))[0]
		setTeamName(selectTeam);
		console.log(selectTeam)
	}

	const confirmDialog = () => {
		setFinalConfirm(true)
	}
	const [finalConfirm, setFinalConfirm] = useState(false);
	const [editAlert, setEditAlert] = useState(false);

	const editHandleClose = (event, reason) => {
		if (reason === 'clickaway') {
			return;
		}
		setEditAlert(false);
	};

	
	return (
		<React.Fragment>
			{isLoading !== false ? (
				<div>

				</div>
			)
				:
				(
					<React.Fragment>
						
						<Accordion expanded={expanded === 'private'} onChange={handleChange('private')}>
							<AccordionSummary aria-controls="panel1d-content" >
								<PersonIcon />
								<Typography fontFamily="-apple-system" sx={{ fontWeight: 'bold', ml: '10px' }}>
									{'Private'}
								</Typography>
								<Badge badgeContent={todos.length} color="primary" showZero sx={{ ml: '5px' }}>
									<AssignmentIcon color="action" />
								</Badge>
							</AccordionSummary>
							<AccordionDetails>
								{
									todos.map((todo, i) => {
										return (
											<List sx={style} key={i} >
												<ListItem divider secondaryAction={
													<PrivateEditMenu
														content={shareOpen['todoContent']}
														menuButtonClick={() => menuButtonClick(todo['id'], todo['team_id'], todo['content'], todo['memo'], todo['dead_line'])}
														editDialogShow={() => setEditOpen({ "is_open": true })}
														confirmDialog={() => confirmDialog()}
													/>}
												>
													<IconButton onClick={() => doneButtonClicked(todo['id'], todo['content'])}>
														<CheckCircleOutlineIcon />
													</IconButton>
													<ListItemText primary={todo.content} secondary={changeDate(todo.dead_line)} />
												</ListItem>
											</List>
										)
									})
								}




								<Dialog
									open={open.is_open}
									onClose={handleClose}
									value={open.todoContent}

								>
									<React.Fragment>
										{open.todoContent === '' ? (
											<React.Fragment>

											</React.Fragment>
										) : (
											<React.Fragment>
												<DialogTitle >
													{open.todoContent}
												</DialogTitle>
												<DialogContent>
													<DialogContentText>
														{'このTodoを遂行しましたか?'}
													</DialogContentText>
												</DialogContent>
												<DialogActions>
													<Button onClick={handleClick} >No</Button>
													<Button onClick={handleAgreeClick}>Yes</Button>
												</DialogActions>
											</React.Fragment>
										)}
									</React.Fragment>
								</Dialog>
							</AccordionDetails>
						</Accordion>
						<Snackbar
							open={alert}
							autoHideDuration={6000}
							onClose={errorHandleClose}
							anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
						>
							<Alert severity="success" >
								<AlertTitle>successful</AlertTitle>
								よくやりましたTodo完了です
								<IconButton
									size="small"
									aria-label="close"
									color="inherit"
									onClick={errorHandleClose}
								>
									<CloseIcon fontSize="small" />
								</IconButton>
							</Alert>
						</Snackbar>
					</React.Fragment>
				)
				// )
			}

			{isLoading !== false ? (
				<Box sx={{ position: 'absolute', top: '45%', left: '40%' }}>
					<CircularProgress size={70} />
				</Box>
			) :
				teams.length !== 0 ? (
					<React.Fragment>
						{teams.map((team) => (
							<Accordion key={team.name} expanded={expanded === `${team.name}`} onChange={handleChange(`${team.name}`)}>
								<AccordionSummary>
									<GroupsIcon />
									<Typography sx={{ fontWeight: 'bold', ml: '10px' }}>
										{team.name}
									</Typography>
									<Badge color="primary" badgeContent={getShareBadges(team.id)} showZero sx={{ ml: '5px' }}>
										<AssignmentIcon color="action" />
									</Badge>
								</AccordionSummary>
								<AccordionDetails>
									{
										shareTodos.map((shareTodo, k) => (
											//if statements and for loops are not expressions in JavaScript, so they can’t be used in JSX directly.
											() => {
												// console.log(teams.length);
												if (team.id === shareTodo.team_id) {
													return (
														<List sx={style} key={k} >
															<ListItem divider secondaryAction={
																<EditMenu
																	content={shareOpen['todoContent']}
																	menuButtonClick={() => menuButtonClick(shareTodo['id'], shareTodo['team_id'], shareTodo['content'], shareTodo['memo'], shareTodo['dead_line'])}
																	editDialogShow={() => setEditOpen({ "is_open": true })}
																	confirmDialog={() => confirmDialog()}
																/>}
															>
																<IconButton onClick={() => shareDoneButtonClicked(shareTodo['id'], shareTodo['content'])}>
																	<CheckCircleOutlineIcon />
																</IconButton>
																<ListItemText primary={shareTodo.content} secondary={changeDate(shareTodo.dead_line)} />
															</ListItem>
														</List>

													)
												}
											}
										)())
									}
								</AccordionDetails>
							</Accordion>
							
						))}
						<Dialog
							open={shareOpen.is_open}
							onClose={handleClose}
							value={shareOpen.todoContent}
						>
							<React.Fragment>
								{shareOpen.todoContent === '' ? (
									<React.Fragment>

									</React.Fragment>
								) : (
									<React.Fragment>
										<DialogTitle id="alert-dialog-title">
											{shareOpen.todoContent}
										</DialogTitle>
										<DialogContent>
											<DialogContentText>
												{'このTodoを遂行しましたか?'}
											</DialogContentText>
										</DialogContent>
										<DialogActions>
											<Button onClick={handleClick} >No</Button>
											<Button onClick={shareTodoAgreeClicked}>Yes</Button>
										</DialogActions>
									</React.Fragment>
								)}
							</React.Fragment>

						</Dialog>

						<Dialog open={finalConfirm}>
							<DialogTitle>
								<Alert severity="warning">※注意　最終確認</Alert>
							</DialogTitle>
							<DialogContent>
								<DialogContentText sx={{ fontWeight: 'bold' }}>
									{'これはチームのTodoです本当に消してもよいですか❓'}
								</DialogContentText>
							</DialogContent>
							<DialogActions>
								<Button onClick={() => setFinalConfirm(false)} >No</Button>
								<Button onClick={() => deleteButtonClick(menuOpen['id'])}>Yes</Button>
							</DialogActions>
						</Dialog>
						<EditDialog
							open={editOpen['is_open']}
							editDialogClose={editDialogClose}
							content={menuOpen['content']}
							memo={menuOpen['memo']}
							deadline={menuOpen['deadline']}
							team_id={menuOpen['team']}
							id={menuOpen['id']}
							teams={teams}
							alert={() => setEditAlert(true)}
							teamName={teamName}
						/>
						<Snackbar
							open={editAlert}
							autoHideDuration={6000}
							onClose={editHandleClose}
							anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
						>
							<Alert severity="success" >
								<AlertTitle>{'successful'}</AlertTitle>
								{'編集成功しました！'}
								<IconButton
									size="small"
									aria-label="close"
									color="inherit"
									onClick={editHandleClose}
								>
									<CloseIcon fontSize="small" />
								</IconButton>
							</Alert>
						</Snackbar>

					</React.Fragment>
				) : (
					<Typography sx={{ml:'10%', mt: '5%'}}>チームに所属していません</Typography>
				)
			}
			<Box height="150px" />
		</React.Fragment >
	);
};

export default Todo;
