import React from 'react';
import {
	Slide,
	ThemeProvider,
	Toolbar,
	Avatar,
	useScrollTrigger,
	CssBaseline,
	Typography,
	AppBar,
	Button,
} from '@mui/material';
import theme from '../../theme';
import PropTypes from 'prop-types'
import { auth } from "../../firebase"
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import { useNavigate } from 'react-router-dom';
import { IconButton } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import { signOut, getAuth } from "firebase/auth";



const HideOnScroll = (props) => {
	const { children, window } = props;
	const trigger = useScrollTrigger({
		target: window ? window() : undefined,
	});

	return (
		<Slide appear={false} direction="down" in={!trigger}>
			{children}
		</Slide>
	)
}

HideOnScroll.propTypes = {
	children: PropTypes.element.isRequired,
	window: PropTypes.func,
};

const SignOut = () => {
	const auth = getAuth();

	const navigate = useNavigate();

	const signOutWithGoogle = () => {
		signOut(auth)
			.then((result) => {
				navigate("/")
			})
			.catch((error) => {
			})
	}

	return (
			<IconButton onClick={signOutWithGoogle} color="inherit" display="block" sx = {{margin : "0 0 0 auto"}}>
				<LogoutIcon />
			</IconButton>
	)
}


const Header = (props) => {
	const navigate = useNavigate();
	const user = auth.currentUser;
	const email = user['email'].substr(0, user['email'].indexOf("@"));
	const photoURL = user.photoURL;
	// const [ isLoading, setIsLosding ] = useState(true);
	return (
		//themeの設定
		<ThemeProvider theme={theme}>
			<React.Fragment>
				<CssBaseline />
				<HideOnScroll {...props}>
					<AppBar>
						<Toolbar sx={{ m: 0.1 }}>
							<Avatar src={photoURL} />
							<Typography variant="h6" component="div" sx={{ ml: 2 }}>
								{email}
							</Typography>
							<Button endIcon={<GroupAddIcon />} color="white" sx={{ml:5}} onClick={() => navigate("/jointeam")} >
								Join
							</Button>
							<SignOut />
						</Toolbar>
					</AppBar>
				</HideOnScroll>
				<Toolbar />
			</React.Fragment>
		</ThemeProvider>
	);
}

export default Header;