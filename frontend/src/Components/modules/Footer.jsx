import React, {useState} from 'react';
import AppBar from '@mui/material/AppBar';
import { ThemeProvider } from '@mui/material';
import theme from '../../theme';
import HomeIcon from '@mui/icons-material/Home';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useNavigate } from 'react-router-dom';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';

const Footer = (props) => {
    const { label } = props;
    const navigate = useNavigate();
    const [value, setValue] = useState(label);

    
    return (
        //themeの設定
        <ThemeProvider theme={theme}>
            <React.Fragment>
                <AppBar position="fixed" sx={{ top: 'auto', bottom: 0 }}>
                        <BottomNavigation
                            showLabels
                            value={value}
                            onChange={(event, newValue) => {
                                setValue(newValue);
                                navigate(`/${newValue}`)
                            }}
                        >
                            <BottomNavigationAction label="Home" value="home" icon={<HomeIcon />} />
                            <BottomNavigationAction label="Done" value="done" icon={<CheckCircleIcon />} />
                            <BottomNavigationAction label="Calendar" value="calendar" icon={<CalendarMonthIcon />} />
                        </BottomNavigation>
                </AppBar>
            </React.Fragment>
        </ThemeProvider>
    );
}

export default Footer;