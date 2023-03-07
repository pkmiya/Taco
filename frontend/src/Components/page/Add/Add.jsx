/* eslint-disable eqeqeq */
import React, { useEffect } from "react";
// import axios from "../../modules/axios"
import Header from "../../modules/Header";
import Footer from "../../modules/Footer";
import Subheader from "../../modules/Subheader";
import {
    TextField,
    MenuItem,
    Box,
    ThemeProvider,
    Button,
    Snackbar,
    IconButton,
    Alert,
    AlertTitle,
    Grid,
    Paper
} from '@mui/material'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { useState } from "react";
import theme from '../../../theme';
import axios from '../../modules/axios'
import { auth } from "../../../firebase";
import { useNavigate } from "react-router-dom";
import CloseIcon from '@mui/icons-material/Close';
import SendIcon from '@mui/icons-material/Send';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';

const BackArrowButton = () => {
    const navigate = useNavigate();
    return (
        <IconButton sx={{ ml: 1, mt: 1 }} onClick={() => navigate("/home")}>
            <ArrowBackIosNewIcon />
        </IconButton>
    )
}

const Add = () => {

    const [deadLine, setDeadLine] = useState(new Date());
    const [team, setTeam] = useState(0)
    const [memo, setMemo] = useState("");
    const [content, setContent] = useState('');
    const [teams, setTeams] = useState([]);
    const [open, setOpen] = useState(false);



    const errorHandleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpen(false);
    };

    const navigate = useNavigate();

    useEffect(() => {
        const accessToken = auth.currentUser.accessToken;
        const fetchTeams = async () => {
            const response = await axios.get(`/teams`, {
                headers: { Authorization: accessToken }
            })
            const body = await response.data;
            setTeams(body);
            // let badgesAsTeams = new Array(body.length)
        }
        fetchTeams();

    }, [])

    const onClickAddButton = async () => {
        if (content) {
            const accessToken = auth.currentUser.accessToken;
            if (team == 0) {
                await axios.post('/todos', {
                    headers: { Authorization: accessToken },
                    content: content,
                    dead_line: deadLine,
                    memo: memo
                }).then((response) => {
                    navigate('/home');
                })
            } else {
                const getSetShareTodos = async () => {
                    await axios.post('/sharetodos', {
                        headers: { Authorization: accessToken },
                        team_id: team,
                        content: content,
                        dead_line: deadLine,
                        memo: memo
                    }).then(async (response) => {
                        navigate('/home');
                        const todoSharedId = response.data.insertId;
                        await axios.post('/sharetodos/status', {
                            headers: { Authorization: accessToken },
                            team_id: team,
                            todo_shared_id: todoSharedId
                        })
                    })
                }
                getSetShareTodos()
            }
        }
        else {
            setOpen(true);
        }

    }


    // const postShareTodo = async() => {

    // }
    return (
        <ThemeProvider theme={theme}>
            <Header />
            <Subheader pageName="Add" />
            <BackArrowButton />
            <Box
                component="form"
                sx={{
                    '& .MuiTextField-root': { m: 1.5, width: '30ch' },
                    // border: '3px dashed grey'
                }}
                mt={"3%"}
                mr='auto'
                ml='auto'
                mb={"3%"}
                noValidate
                autoComplete="off"
                method="POST"
                width="95%"

            >
                <Paper elevation={5} >
                    <Grid container alignItems='center' justifyContent='center' direction="column" >
                        <TextField
                            select
                            label="Team"
                            value={team}
                            onChange={(newValue) => {
                                setTeam(newValue.target.value);
                            }}
                            helperText="Please select your team"
                            variant="standard"
                        >
                            <MenuItem key="0" value="0" >
                                個人用
                            </MenuItem>
                            {teams.map((team) => (
                                <MenuItem key={team.id} value={team.id}>
                                    {team.name}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Grid>

                    <Grid container alignItems='center' justifyContent='center' direction="column" >
                        <TextField
                            id="todo"
                            required
                            label="Todo"
                            variant="standard"
                            onChange={(newValue) => {
                                setContent(newValue.target.value);
                            }}
                            error={!content}
                        />
                    </Grid>

                    <Grid container alignItems='center' justifyContent='center' direction="column" >
                        <TextField
                            label="Memo"
                            multiline
                            rows={2}
                            variant="standard"
                            onChange={(newValue) => {
                                setMemo(newValue.target.value);
                            }}
                        />
                    </Grid>

                    <Grid container alignItems='center' justifyContent='center' direction="column" >
                        <LocalizationProvider dateAdapter={AdapterDayjs} >
                            <DatePicker
                                label="〆切日"
                                value={deadLine}
                                onChange={(newValue) => {
                                    const newDate = new Date(newValue);
                                    setDeadLine(newDate);
                                }}
                                renderInput={(params) => <TextField {...params} />}
                            />
                        </LocalizationProvider>
                    </Grid>
                </Paper>

            </Box>
            <Button variant="contained" onClick={onClickAddButton} size="large" endIcon={<SendIcon />} sx={{ position: 'fixed', right: 25, bottom: 90 }}>
                Submit
            </Button>
            <Snackbar
                open={open}
                autoHideDuration={6000}
                onClose={errorHandleClose}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert severity="error" >
                    <AlertTitle>Error</AlertTitle>
                    Todoを入力してください
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
            <Footer />
        </ThemeProvider>
    );
};

export default Add;
