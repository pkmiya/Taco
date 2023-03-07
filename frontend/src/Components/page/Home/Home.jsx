import React, { useEffect } from "react";
import Header from "../../modules/Header";
import Footer from "../../modules/Footer";
// import AddIcon from "../../modules/AddIcon";
import Subheader from "../../modules/Subheader";
import Todo from "../../modules/Todo";
import { useNavigate } from 'react-router-dom';
import { onAuthStateChanged } from "firebase/auth";
import { useAuthContext } from "../../../context/AuthContext";
import theme from '../../../theme';
import { ThemeProvider,  Fab } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';

const AddIcon = () => {
    const navigate = useNavigate();
    return (
        <ThemeProvider theme={theme}>
            <React.Fragment>

                <Fab color="primary" onClick={() => navigate('/add')} fontSize="large" sx={{ fontSize: 60, position: 'fixed', right: 25, bottom: 90 }} >
                    <EditIcon fontSize='small'/>
                </Fab>
            </React.Fragment>
        </ThemeProvider>
    )
}


const Home = () => {
    
    const { auth } = useAuthContext();
    const navigate = useNavigate();
    useEffect(() => {
        onAuthStateChanged(auth, async (currentUser) => {
            if (!currentUser) {
                navigate("/");
            }
        })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    return (
        <React.Fragment>
            <Header />
            <Subheader pageName="ToDo" />
            <Todo />
            <AddIcon />
            <Footer label="home"/>
        </React.Fragment>

    )
}

export default Home;