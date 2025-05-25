import {
    AppBar,
    Box,
    Divider,
    IconButton,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText, Menu, MenuItem,
    Toolbar,
    Typography
} from "@mui/material";
import React, {useState} from "react";
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircle from "@mui/icons-material/AccountCircle";
import Drawer from '@mui/material/Drawer';
import CategoryIcon from '@mui/icons-material/Category';
import {useNavigate} from "react-router-dom";
import {useAppStore} from "../state.js";

const drawerWidth = 240;

function DrawerListItem({key, text, url, closeDrawer}) {
    const navigate = useNavigate();

    return (
        <ListItem key={key} disablePadding>
            <ListItemButton onClick={() => {
                navigate(url);
                closeDrawer();
            }}>
                <ListItemIcon>
                    <CategoryIcon/>
                </ListItemIcon>
                <ListItemText primary={text}/>
            </ListItemButton>
        </ListItem>
    );
}

function NavigationDrawer({closeDrawer}) {
    const role = useAppStore(state => state.role);

    return (
        <>
            <Toolbar>
                <Typography variant="h6" component="div" sx={{flexGrow: 1}}>Apz</Typography>
            </Toolbar>
            <Divider/>
            <List>
                <DrawerListItem key="sensors" text="Sensors" url="/sensors" closeDrawer={closeDrawer}/>
                <DrawerListItem key="forecast" text="Forecast" url="/forecast" closeDrawer={closeDrawer}/>

                {role === 999 && <Divider/>}

                {role === 999 && <DrawerListItem key="admin_users" text="(Admin) Users" url="/admin/users" closeDrawer={closeDrawer}/>}
                {role === 999 && <DrawerListItem key="admin_cities" text="(Admin) Cities" url="/admin/cities" closeDrawer={closeDrawer}/>}
                {role === 999 && <DrawerListItem key="admin_sensors" text="(Admin) Sensors" url="/admin/sensors" closeDrawer={closeDrawer}/>}
                {role === 999 && <DrawerListItem key="admin_measurements" text="(Admin) Measurements" url="/admin/measurements" closeDrawer={closeDrawer}/>}
                {role === 999 && <DrawerListItem key="admin_backups" text="(Admin) Backups" url="/admin/backups" closeDrawer={closeDrawer}/>}
            </List>
        </>
    );
}

function Navigation({title}) {
    const [anchorEl, setAnchorEl] = useState(null);
    const [mobileOpen, setMobileOpen] = useState(false);
    const navigate = useNavigate();

    const userName = useAppStore((state) => state.userName);
    const logOut = useAppStore((state) => state.logOut);

    const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
    const handleMenuClose = () => setAnchorEl(null);

    const handleDrawerToggle = () => setMobileOpen(!mobileOpen);

    return (<>
        <Box sx={{flexGrow: 1}}>
            <AppBar position="static">
                <Toolbar>
                    <IconButton size="large" edge="start" color="inherit" aria-label="menu" sx={{mr: 2}}>
                        <MenuIcon onClick={handleDrawerToggle}/>
                    </IconButton>
                    <Typography variant="h6" component="div" sx={{flexGrow: 1}}>
                        {title}
                    </Typography>

                    <IconButton size="large" onClick={handleMenuOpen} color="inherit">
                        <AccountCircle/>
                    </IconButton>
                    <Menu anchorEl={anchorEl} anchorOrigin={{vertical: "top", horizontal: 'right'}} keepMounted
                          transformOrigin={{vertical: "top", horizontal: "right"}} open={Boolean(anchorEl)}
                          onClose={handleMenuClose}>
                        <MenuItem disabled={true}>Hi, {userName}</MenuItem>
                        <MenuItem onClick={() => {
                            logOut();
                            handleMenuClose();
                            navigate("/login");
                        }}>Log out</MenuItem>
                    </Menu>
                </Toolbar>
            </AppBar>
        </Box>

        <Box component="nav" sx={{width: {sm: drawerWidth}, flexShrink: {sm: 0}}}>
            <Drawer container={() => window.document.body} variant="temporary" open={mobileOpen}
                    onClose={handleDrawerToggle} ModalProps={{keepMounted: true}}
                    sx={{'& .MuiDrawer-paper': {boxSizing: 'border-box', width: drawerWidth}}}>
                <NavigationDrawer closeDrawer={() => setMobileOpen(false)}/>
            </Drawer>
        </Box>
    </>);
}

export default Navigation;