import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { ThemeProvider, Typography, Box, Button, CircularProgress, LinearProgress } from '@mui/material';
import theme from '../../theme'
import { onAuthStateChanged, signInWithPopup, } from 'firebase/auth';
import { provider, auth } from '../../firebase';
import { useState } from 'react';


const SingIn = () => {

    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);

    // const signInWithGoogle = () => {
    //     signInWithRedirect(auth, provider)
    //         .then(() => {
    //             navigate("/home");
    //         })
    //     setLoading(true);
    // }
    const signInWithGoogle = () => {
        signInWithPopup(auth, provider)
            .then(() => {
                navigate("/home");
            })
        setIsLoading(true);
    }

    useEffect(() => {
        onAuthStateChanged(auth, async (currentUser) => {
            if (currentUser) {
                navigate("/home");
            }
        })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    return (
        <ThemeProvider theme={theme}>
            <React.Fragment>
                {isLoading === false ? (
                    <React.Fragment>
                        <Box sx={{height:'100%', p:10}} >
                            <Typography variant='h4' sx={{
                            height:400,
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}>{'LogIn to TacoClass'}</Typography>
                        </Box>
                        
                        <Button
                            onClick={signInWithGoogle}
                            variant="outlined"
                            sx={{ position: 'absolute', top: '50%', left: '20%' }}
                        >
                            {'学校のアカウントでログイン'}
                        </Button>
                    </React.Fragment>
                ) : (
                    <React.Fragment>
                        <Box sx={{ position: 'absolute', top: '45%', left: '42%' }}>
                            <CircularProgress size={70} />
                            <Typography color='primary'>{'Loading...'}</Typography>
                            <LinearProgress sx={{ width: '100%' }} />
                        </Box>
                    </React.Fragment>
                )}


            </React.Fragment>
        </ThemeProvider>

    )
}

export default SingIn