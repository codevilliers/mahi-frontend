import React, { useEffect, useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Paper from '@material-ui/core/Paper'
import CloseIcon from '@material-ui/icons/Close'
import {
  Button,
  CircularProgress,
  IconButton,
  InputAdornment,
  TextField,
  Typography
} from '@material-ui/core'
import { useDispatch, useSelector } from 'react-redux'
import firebase from 'firebase/app'
import 'firebase/auth'

import { cleanOTP } from '../../actions/SignupActions'
import {
  sendOTP,
  VerifyOTP,
  googleLogin,
  facebookLogin
} from '../../actions/AuthActions'
import FacebookIcon from '../../icons/fb'
import GoogleIcon from '../../icons/google'
import { Redirect, useHistory } from 'react-router-dom'
import { validatePhoneNumber } from '../../utils/validations'

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    height: '100vh',
    backgroundColor: '#fff',
    padding: '0.9375rem 1.25rem',
    boxSizing: 'border-box'
  },
  closeButtonContainer: {
    display: 'flex',
    justifyContent: 'flex-end'
  },
  header: {
    fontSize: '1.5rem',
    marginTop: '2 rem'
  },
  wide_input: {
    width: '100%',
    marginTop: '2.25rem'
  },
  custom_button: {
    color: '#fff',
    fontWeight: 500,
    background: '#6552FF',
    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.15)',
    height: '2.75rem',
    '&:hover': {
      background: '#6552EF'
    }
  },
  custom_label: {
    fontSize: '0.875rem',
    opacity: 0.2,
    color: '#000'
  },
  divider: {
    margin: '2rem 0',
    display: 'flex',
    alignItems: 'center',
    padding: '0 2rem'
  },
  separator: {
    width: '100%',
    height: 0,
    border: '1px solid rgba(0, 0, 0, 0.08)'
  },
  dividerContent: {
    padding: '0.5rem',
    fontSize: '0.875rem'
  },
  socialAuthContainer: {
    width: '100%',
    display: 'flex',
    justifyContent: 'space-around'
  },
  socialAuthButton: {
    textTransform: 'none',
    height: '2.75rem',
    padding: '1rem 1.5rem'
  },
  loader: {
    width: '100%',
    height: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  hiddenDiv: {
    visibility: 'hidden'
  },
  registerContainer: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: '1.5rem',
    fontSize: '0.875rem'
  },
  registerLink: {
    color: '#0000EE ',
    cursor: 'pointer',
    marginLeft: '0.3rem'
  }
}))

export default function SignIn () {
  const classes = useStyles()
  const [phone_number, setPhoneNumber] = useState(null)
  const [phone_error, setPhoneError] = useState(null)
  const [otp, setOTP] = useState(null)

  const dispatch = useDispatch()
  const history = useHistory()

  const confirmationResult = useSelector(state => state.OTP.confirmationResult)
  const otpSending = useSelector(state => state.OTP.otpSending)
  const otpPending = useSelector(state => state.OTP.otpPending)
  const isAuthenticated = useSelector(state => state.auth.isAuthenticated)
  const signingIn = useSelector(state => state.auth.signingIn)

  useEffect(() => {
    window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('reCaptcha')
    window.recaptchaVerifier.render().then(function (widgetId) {
      window.recaptchaWidgetId = widgetId
    })
  }, [])

  useEffect(() => {
    return () => {
      dispatch(cleanOTP)
    }
  })

  const handlePhoneChange = event => {
    setPhoneNumber(event.target.value)
  }

  const handleOTPChange = event => {
    setOTP(event.target.value)
  }

  const send_OTP = () => {
    var appVerifier = window.recaptchaVerifier
    let phone_validation = validatePhoneNumber(phone_number)
    if (phone_validation.status === false) {
      setPhoneError(phone_validation.error)
    } else {
      setPhoneError(null)
      dispatch(sendOTP(phone_number, appVerifier))
    }
  }

  const verify_OTP = () => {
    dispatch(VerifyOTP(confirmationResult, otp))
  }

  const google_login = () => {
    dispatch(googleLogin())
  }

  const facebook_login = () => {
    dispatch(facebookLogin())
  }

  const returnHome = () => {
    history.push('/')
  }

  const register = () => {
    history.push('/register')
  }

  return (
    <React.Fragment>
      {signingIn ? (
        <div>
          <div className={classes.loader}>
            <CircularProgress />
          </div>
          <div id='reCaptcha' className={classes.hiddenDiv}></div>
        </div>
      ) : (
        <Paper className={classes.root} elevation={0}>
          {isAuthenticated && <Redirect to='/' />}
          <div className={classes.closeButtonContainer}>
            <IconButton onClick={returnHome}>
              <CloseIcon />
            </IconButton>
          </div>
          <Typography className={classes.header}>Sign in</Typography>
          <form>
            <TextField
              onChange={handlePhoneChange}
              className={classes.wide_input}
              label='Phone Number'
              InputLabelProps={{ className: classes.custom_label }}
              disabled={otpSending || otpPending}
              error={phone_error ? true : false}
              helperText={phone_error ? phone_error : ''}
              InputProps={{
                startAdornment: (
                  <InputAdornment position='start'>+91</InputAdornment>
                )
              }}
            />
            <div id='reCaptcha' style={{ marginTop: '2.25rem' }} />
            <TextField
              onChange={handleOTPChange}
              className={classes.wide_input}
              label='OTP'
              InputLabelProps={{ className: classes.custom_label }}
              style={{ display: otpPending ? 'inline-flex' : 'none' }}
            />
            <Button
              variant='contained'
              className={`${classes.custom_button} ${classes.wide_input}`}
              disableElevation
              onClick={send_OTP}
              disabled={otpPending === true ? true : false}
            >
              Send OTP
            </Button>
            <Button
              variant='contained'
              className={`${classes.custom_button} ${classes.wide_input}`}
              disableElevation
              onClick={verify_OTP}
              style={{ display: otpPending ? 'block' : 'none' }}
            >
              Verify OTP
            </Button>
          </form>
          <div className={classes.divider}>
            <div className={classes.separator} />
            <span className={classes.dividerContent}>or</span>
            <div className={classes.separator} />
          </div>
          <div className={classes.socialAuthContainer}>
            <Button
              variant='outlined'
              startIcon={<FacebookIcon />}
              className={classes.socialAuthButton}
              onClick={facebook_login}
            >
              Facebook
            </Button>
            <Button
              variant='outlined'
              startIcon={<GoogleIcon />}
              className={classes.socialAuthButton}
              onClick={google_login}
            >
              Google
            </Button>
          </div>
          <div className={classes.registerContainer}>
            Don't have an account?
            <span className={classes.registerLink} onClick={register}>
              Register here
            </span>
          </div>
        </Paper>
      )}
    </React.Fragment>
  )
}
