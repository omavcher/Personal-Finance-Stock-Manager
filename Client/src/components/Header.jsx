import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, Button, Container, useMediaQuery, Drawer, IconButton } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { styled } from '@mui/system'; // Use the styled API for custom styles
import MenuIcon from '@mui/icons-material/Menu'; // Import Material-UI Menu icon
import { Link } from 'react-router-dom'; // Import Link for SPA navigation

import '../style/Header.css';

// Styled Components using the styled API
const HeaderWrapper = styled(AppBar)({
  backgroundColor: '#000',
  boxShadow: 'none',
  padding: '10px 0',
});

const Logo = styled(Typography)({
  color: '#fff',
  fontSize: '24px',
  fontWeight: 'bold',
});

const NavLinks = styled('div')({
  display: 'flex',
  gap: '20px',
});

const NavButton = styled(Button)({
  color: '#fff',
  fontWeight: 600,
  '&:hover': {
    backgroundColor: '#25a56d', // Hover color
  },
});

const MobileMenu = styled('div')({
  display: 'none',
  '@media (max-width:600px)': {
    display: 'block', // Shows mobile menu on small screens
  },
});

function Header() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm')); // Check if screen is mobile-sized
  const [drawerOpen, setDrawerOpen] = useState(false);

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  return (
    <HeaderWrapper position="static">
      <Container>
        <Toolbar>
          <Logo variant="h6">PlanAhead</Logo>

          {/* Navigation Links for Larger Screens */}
          {!isMobile && (
            <NavLinks>
              <NavButton component={Link} to="/">Home</NavButton>
              <NavButton component={Link} to="/credit-cards">Cards</NavButton>
              <NavButton component={Link} to="/stocks">Stocks</NavButton>
              <NavButton component={Link} to="/fds">FD's</NavButton>
              <NavButton component={Link} to="/profile">Profile</NavButton>
               <NavButton component={Link} to="/login">Login</NavButton>
            </NavLinks>
          )}

          {/* Hamburger Icon for Mobile */}
          <MobileMenu>
            <IconButton onClick={toggleDrawer} style={{ color: '#fff' }}>
              <MenuIcon />
            </IconButton>
          </MobileMenu>
        </Toolbar>
      </Container>

      {/* Mobile Drawer Menu */}
      <Drawer anchor="right" open={drawerOpen} onClose={toggleDrawer}>
        <div
          role="presentation"
          onClick={toggleDrawer}
          onKeyDown={toggleDrawer}
          style={{ width: 'auto', height: "100%", padding: '20px 50px 0 50px', backgroundColor: '#000', color: '#fff' }}
        >
          <NavButton component={Link} to="/">Home</NavButton>
          <NavButton component={Link} to="/credit-cards">Cards</NavButton>
          <NavButton component={Link} to="/stocks">Stocks</NavButton>
          <NavButton component={Link} to="/fds">FD's</NavButton>
          <NavButton component={Link} to="/profile">Profile</NavButton>
                         <NavButton component={Link} to="/login">Login</NavButton>
        </div>
      </Drawer>
    </HeaderWrapper>
  );
}

export default Header;
