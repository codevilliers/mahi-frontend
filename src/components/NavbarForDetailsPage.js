import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import AppBar from '@material-ui/core/AppBar'
import {
  Avatar,
  CardHeader,
  ThemeProvider,
  Toolbar
} from '@material-ui/core'
import { theme } from '../theme'
import NavbarContent from './Navbar'

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    boxShadow: '0px 0px 7px rgba(0, 0, 0, 0.1)',
    width: '100%',
    position: 'fixed',
    alignItems: 'center',
    zIndex: 1100,
  }
}))

export function NavbarForDetailsPage ({ cause }) {
    const classes = useStyles()
    return (
      <div>
        <div className={classes.root}>
        <ThemeProvider theme={theme}>
          <AppBar position='static' elevation={0}>
            <NavbarContent />
            <CardHeader
              avatar={
                <Avatar
                  src={cause.needy_photo ? cause.needy_photo : ''}
                  className={classes.avatar}
                >
                </Avatar>
              }
              title={cause.needy_name}
              subheader={
                <div className={classes.subheader}>
                  <div className={classes.subheader_text}>
                    {cause.needy_address}
                  </div>
                </div>
              }
              className={classes.cardHeader}
            />
          </AppBar>
        </ThemeProvider>
      </div>
      <div style={{paddingBottom: '9rem'}}></div>
      </div>
    )
  }
  