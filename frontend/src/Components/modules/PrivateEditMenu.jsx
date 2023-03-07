import React, { useState } from 'react'
import {
    IconButton,
    Menu,
    MenuItem
} from "@mui/material";
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';

const EditMenu = (props) => {
    const { editDialogShow, menuButtonClick } = props;
    const [anchorEl, setAnchorEl] = useState(null);
    const isEditMenuOpend = Boolean(anchorEl);
    const editMenuClose = () => {
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
            </Menu>
        </React.Fragment >
    )
}

export default EditMenu