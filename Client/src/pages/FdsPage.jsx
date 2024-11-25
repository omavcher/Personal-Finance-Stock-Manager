import React, { useState, useEffect } from 'react';
import '../style/FdsPage.css';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import Grow from '@mui/material/Grow';
import Paper from '@mui/material/Paper';
import Popper from '@mui/material/Popper';
import MenuItem from '@mui/material/MenuItem';
import MenuList from '@mui/material/MenuList';
import AlertComponent from '../components/AlertComponent.jsx';
import api from '../api.js';
import Loader from '../components/Loader.jsx';

const options = ['1Y', '3Y', '5Y'];

function FdsPage() {
  const [funds, setFunds] = useState([]);
  const [open, setOpen] = React.useState(false);
  const anchorRef = React.useRef(null);
  const [selectedIndex, setSelectedIndex] = React.useState(0); // Default to '1Y'
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState(null);

  const handleAlert = (type, message) => {
    setAlert({ severity: type, message });
  };

  useEffect(() => {

    const fetchFD = async () => {
      try {
        const response = await api.get(`/api/users/muture/funds`);
        setFunds(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching funds:', err);  // Logs the full error for debugging
        if (err.response) {
          // Server responded with a status other than 2xx
          handleAlert('error', `Error fetching mutual funds: ${err.response.data.message || 'Please try again later.'}`);
        } else if (err.request) {
          // No response received from the server
          handleAlert('error', 'Network error. Please check your connection.');
        } else {
          // Other types of errors
          handleAlert('error', `An unexpected error occurred: ${err.message}`);
        }
        setLoading(false);
      }
    };

    fetchFD();
  }, []);

  const handleClick = () => {
    console.info(`You clicked ${options[selectedIndex]}`);
  };

  const handleMenuItemClick = (event, index) => {
    setSelectedIndex(index);
    setOpen(false);
  };

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }

    setOpen(false);
  };

  const getReturnValue = (fund) => {
    switch (selectedIndex) {
      case 0: return fund.return1y;
      case 1: return fund.return3y;
      case 2: return fund.return5y;
      default: return fund.return1y;
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="fds-page">
      <header className="page-header">
        <h1>Mutual Funds in India</h1>
        <p>Explore top-performing mutual funds based on your financial goals.</p>
      </header>
      {alert && <AlertComponent severity={alert.severity} message={alert.message} />}

      <div className='return-sointain-tbn4'>
        <React.Fragment>
          <ButtonGroup
            variant="contained"
            ref={anchorRef}
            aria-label="Button group with a nested menu"
            sx={{
              backgroundColor: 'black',
              color: 'white',  // Optional: Set text color to white for better contrast
              '&:hover': {
                backgroundColor: '#333',  // Optional: Darker shade on hover
              }
            }}
          >
            <Button onClick={handleClick} sx={{
              backgroundColor: 'black',
              color: 'white',
              '&:hover': {
                backgroundColor: '#333',
              }
            }}>{options[selectedIndex]}</Button>
            <Button
              size="small"
              aria-controls={open ? 'split-button-menu' : undefined}
              aria-expanded={open ? 'true' : undefined}
              aria-label="select merge strategy"
              aria-haspopup="menu"
              onClick={handleToggle}
            >
              <ArrowDropDownIcon />
            </Button>
          </ButtonGroup>
          <Popper
            sx={{ zIndex: 1 }}
            open={open}
            anchorEl={anchorRef.current}
            role={undefined}
            transition
            disablePortal
          >
            {({ TransitionProps, placement }) => (
              <Grow
                {...TransitionProps}
                style={{
                  transformOrigin:
                    placement === 'bottom' ? 'center top' : 'center bottom',
                }}
              >
                <Paper>
                  <ClickAwayListener onClickAway={handleClose}>
                    <MenuList id="split-button-menu" autoFocusItem>
                      {options.map((option, index) => (
                        <MenuItem
                          key={option}
                          selected={index === selectedIndex}
                          onClick={(event) => handleMenuItemClick(event, index)}
                        >
                          {option}
                        </MenuItem>
                      ))}
                    </MenuList>
                  </ClickAwayListener>
                </Paper>
              </Grow>
            )}
          </Popper>
        </React.Fragment>
      </div>

      <section className="fund-row">
        {funds.map((fund) => (
          <div key={fund.id} className="fund-card">
            <div className='fund-top73'>
              <span>
                <img src={fund.logo_url} alt={fund.fund_name} className="fund-logo" />
                <h2>{fund.fund_name}</h2>
              </span>
              <p>{getReturnValue(fund)}%</p>
            </div>

            <div className='fund-low-456'>
              <span>
                <p>{fund.risk}</p>
                <p>{fund.sub_category}</p>
              </span>
              <p>{options[selectedIndex]}</p>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}

export default FdsPage;
