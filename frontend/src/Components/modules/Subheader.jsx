import { AppBar,Typography,ThemeProvider } from "@mui/material"
import theme from "../../theme";

const Subheader = (props) => {
    return(
        <ThemeProvider theme={theme}>
            <AppBar position="relative" color="secondary" sx={{ mt: 0 }}>
                    <Typography variant="h6" sx={{ mt: 2, mb: 1, ml: 3, fontWeight:'bold'}} >
                        {props.pageName}
                    </Typography>
            </AppBar>
        </ThemeProvider>
    )
}

export default Subheader;
