/* eslint-disable array-callback-return */
import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Chip from '@mui/material/Chip';
import { useEffect } from 'react';
import axios from "./axios";
import { useState } from 'react';
import { auth } from "../../firebase";
import { Button, CircularProgress, Paper, ThemeProvider, Typography } from '@mui/material';
import Header from "./Header";
import Footer from "./Footer"
import colorTheme from '../../theme';
import { useNavigate } from 'react-router-dom';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};

function getStyles(name, teamName, theme) {
    return {
        fontWeight:
            teamName.indexOf(name) === -1
                ? theme.typography.fontWeightRegular
                : theme.typography.fontWeightMedium,
    };
}

export default function JoinTeam() {
    const [isLoading, setIsLoading] = useState(true);
    const theme = useTheme();
    const [teamNames, setTeamNames] = useState([]);
    const navigate = useNavigate();
    const teamHandleChange = (event) => {
        const { target: { value } } = event;

        setTeamNames(
            // On autofill we get a stringified value.
            typeof value === 'string' ? value.split(',') : value,
        );
    };
    
    const [teams, setTeams] = useState([]);
    const [alreadyTeams, setAlreadyTeams] = useState([]);

    useEffect(() => {
        const accessToken = auth.currentUser.accessToken;
        const fetchTeams = async () => {
            const response = await axios.get(`/teams/all`, {
                headers: { Authorization: accessToken }
            })
            const body = await response.data;
            setTeams(body);
            setIsLoading(false);
        }

        const fetchAlreadyTeams = async () => {
            const response = await axios.get(`/teams`, {
                headers: { Authorization: accessToken }
            })
            const body = await response.data;
            setAlreadyTeams(body);
        }
        fetchTeams();
        fetchAlreadyTeams();
    }, []);

    const alreadyTeamName = alreadyTeams.map(({ name }) => name)
    const sortTeams = teams.filter(({ name }) => (alreadyTeamName.indexOf(name) === -1))

    const onClickJoinTeam = async () => {
        // const teamIds = teamNames.map(teamName => teams.filter(team => {if(team.name === teamName) return team.id}));
        var teamIds = [];
        teamNames.map(teamName =>
            teams.map(team => {
                if (team.name === teamName) {
                    teamIds.push(team.id)
                }
            })
        )
        if (teamIds.length !== 0) {
            const accessToken = auth.currentUser.accessToken;
            navigate('/home');
            await axios.post('/teams/join', {
                headers: { Authorization: accessToken },
                teamIds: teamIds,
            }).then((res) => {

            })
        } else {
            console.log("空白です");
            navigate('/home');
        }
    }

    return (
        <ThemeProvider theme={colorTheme}>
            <div>
                <Header />
                {isLoading === false ? (
                    <Box component="div" sx={{ p: 2, mt: '30%' }} >
                        <Typography fontWeight="bold" variant="h3">JOIN TEAM</Typography>
                        <Paper elevation={6} sx={{ mt: 5 }}>
                            <FormControl sx={{ m: 2, width: 300, }} >
                                <InputLabel id="demo-multiple-chip-label" sx={{ mt: 3 }}>Team</InputLabel>
                                <Select
                                    labelId="demo-multiple-chip-label"
                                    id="demo-multiple-chip"
                                    multiple
                                    value={teamNames}
                                    onChange={teamHandleChange}
                                    input={<OutlinedInput id="select-multiple-chip" label="Team" />}
                                    renderValue={(selected) => (
                                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                            {selected.map((value) => (
                                                <Chip key={value} label={value} />
                                            ))}
                                        </Box>
                                    )}
                                    MenuProps={MenuProps}
                                    sx={{ mt: 3 }}
                                >
                                    {sortTeams.map((sortTeam) => (
                                        <MenuItem
                                            key={sortTeam['id']}
                                            value={sortTeam['name']}
                                            style={getStyles(sortTeam['name'], teamNames, theme)}
                                        >
                                            {sortTeam['name']}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            <Button onClick={() => onClickJoinTeam()} variant="contained" sx={{ mt: 1, ml: "65%", mb: 3 }}>JOINTEAM</Button>
                        </Paper>
                    </Box>
                ) : (
                    <Box sx={{ position: 'absolute', top: '45%', left: '40%' }}>
                        <CircularProgress size={70} />
                    </Box>
                )}
                <Footer />
            </div>
        </ThemeProvider>


    );
}