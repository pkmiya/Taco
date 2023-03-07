import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
// import ListItemText from '@mui/material/ListItemText';
// import ListItem from '@mui/material/ListItem';
// import List from '@mui/material/List';
// import Divider from '@mui/material/Divider';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import Slide from '@mui/material/Slide';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import {
    Box, Grid, TextField, ThemeProvider, Snackbar, Alert, AlertTitle
} from '@mui/material'
import { useState, useEffect } from 'react';
import axios from './axios';
import { auth } from "../../firebase"
import theme from '../../theme';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});


export default function EditDialog(props) {
    const { open, editDialogClose, id } = props;

    const [deadline, setDeadline] = useState(new Date(props.deadline));
    const [memo, setMemo] = useState(props.memo);
    const [content, setContent] = useState(props.content);
    const [alertOpen, setAlertOpen] = useState(false);

    const onClickEditButton = async () => {
        if (content) {
            const accessToken = auth.currentUser.accessToken;
            if (props.team_id === undefined) {
                await axios.put('/todos/edit', {
                    headers: { Authorization: accessToken },
                    content: content,
                    dead_line: deadline,
                    memo: memo,
                    id: id
                }).then((response) => {
                    editDialogClose();
                    if (response.statusText === 'OK') {
                        props.alert();
                    }
                })
            } else {
                await axios.put('/sharetodos/edit', {
                    headers: { Authorization: accessToken },
                    content: content,
                    dead_line: deadline,
                    memo: memo,
                    id: id
                }).then((response) => {
                    editDialogClose();
                    if (response.statusText === 'OK') {
                        props.alert();
                    }
                })
            }


        } else {
            setAlertOpen(true);
        }
    }

    useEffect(() => {
        setMemo(props.memo);
        setDeadline(props.deadline);
        setContent(props.content);
    }, [props])

    const errorHandleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setAlertOpen(false);
    };
    // let team = teams.filter(team => team['id'] === props.team_id)[0]
    // let teamName = team.name;
    return (
        <div>
            <ThemeProvider theme={theme}>
                <Dialog
                    fullScreen
                    open={open}
                    onClose={editDialogClose}
                    TransitionComponent={Transition}
                >
                    <AppBar position="fixed" color="primary" sx={{ top: 'auto', bottom: 0 }}>
                        <Toolbar>
                            <IconButton
                                edge="start"
                                color="inherit"
                                onClick={editDialogClose}
                                aria-label="close"
                            >
                                <CloseIcon />
                            </IconButton>
                            <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
                                EditMenu
                            </Typography>
                            <Button autoFocus color="inherit" onClick={onClickEditButton}>
                                save
                            </Button>
                        </Toolbar>
                    </AppBar>
                    <Typography variant="h3" mt={'20%'} ml={'5%'} sx={{ fontWeight: "bold" }}>
                        {
                            (() => {
                                if (props.team_id === undefined) return "PRIVATE"
                                else { return "TEAM" }
                            })()
                        }

                    </Typography>
                    <Box
                        component="form"
                        sx={{
                            '& .MuiTextField-root': { m: 3, width: '30ch' },
                        }}
                        noValidate
                        autoComplete="off"
                        method="POST"
                        mt={'20%'}
                        mb={"20%"}
                    >
                        <Grid container alignItems='center' justifyContent='center' direction="column" >
                            <TextField
                                required
                                label="Todo"
                                variant="standard"
                                onChange={(newValue) => {
                                    setContent(newValue.target.value);
                                }}
                                defaultValue={content}
                            />
                        </Grid>
                        <Grid container alignItems='center' justifyContent='center' direction="column">

                            <TextField
                                label="Memo"
                                multiline
                                rows={2}
                                onChange={(newValue) => {
                                    setMemo(newValue.target.value);
                                }}
                                defaultValue={memo}
                                variant="standard"

                            />
                        </Grid>
                        <Grid container alignItems='center' justifyContent='center' direction="column" >

                            <LocalizationProvider dateAdapter={AdapterDayjs} >
                                <DatePicker
                                    label="〆切日"
                                    value={deadline}
                                    renderInput={(params) => <TextField {...params} />}
                                    onChange={(newValue) => {
                                        const newDate = new Date(newValue);
                                        setDeadline(newDate);
                                    }}
                                />
                            </LocalizationProvider>
                        </Grid>
                    </Box>

                    <Snackbar
                        open={alertOpen}
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

                </Dialog>
            </ThemeProvider>

        </div>
    );
}