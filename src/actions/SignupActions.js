import { apiAuthClient } from '../helpers/apiClient'
import firebase from 'firebase/app'
import 'firebase/auth'

import { USER_APIS } from '../urls'
import {
  GET_OTP_PENDING,
  GET_OTP_SENDING,
  GET_CONFIRMATION_RESULT,
  CREATING_ACCOUNT,
  GET_AUTHENTICATION_STATUS,
  GET_PHONE_NUMBER_EXISTS,
  GET_LOGGEDINUSER,
  CLEAN_OTP,
  AUTH_ERROR,
  OTP_ERROR
} from './AuthActionTypes'

const apiDispatch = (actionType = '', data) => {
  return {
    type: actionType,
    payload: data
  }
}

const apiError = error => {
  return {
    type: AUTH_ERROR,
    error
  }
}

const otpError = error => {
  return {
    type: OTP_ERROR,
    error
  }
}

export const sendOTP = (phone_number, appVerifier) => {
  return dispatch => {
    phone_number = `+91${phone_number.trim()}`
    let check_phone_number_url = USER_APIS.phone_number_exists
    let check_phone_number_data = { phone_number: phone_number }
    apiAuthClient
      .post(check_phone_number_url, check_phone_number_data)
      .then(response => {
        let response_data = response.data
        let phone_number_exists = response_data.phone_number_exists
        if (phone_number_exists) {
          dispatch(apiDispatch(GET_PHONE_NUMBER_EXISTS, true))
        } else {
          dispatch(apiDispatch(GET_PHONE_NUMBER_EXISTS, false))
          dispatch(apiDispatch(GET_OTP_SENDING, true))
          firebase
            .auth()
            .signInWithPhoneNumber(phone_number, appVerifier)
            .then(function (confirmationResult) {
              dispatch(apiDispatch(GET_OTP_SENDING, false))
              dispatch(apiDispatch(GET_OTP_PENDING, true))
              dispatch(apiDispatch(GET_CONFIRMATION_RESULT, confirmationResult))
              // SMS sent. Prompt user to type the code from the message, then sign the
              // user in with confirmationResult.confirm(code).
            })
            .catch(error => {
              dispatch(apiDispatch(GET_OTP_SENDING, false))
              dispatch(apiDispatch(GET_OTP_PENDING, false))
              dispatch(otpError(error))
              // Error; SMS not sent
              // ...
            })
        }
      })
      .catch(error =>{
        dispatch(apiError(error))
      })
  }
}

export const VerifyOTP = (confirmationResult, code, name) => {
  return dispatch => {
    let login_url = USER_APIS.login
    confirmationResult
      .confirm(code)
      .then(result => {
        // User signed in successfully.
        dispatch(apiDispatch(GET_OTP_PENDING, false))
        dispatch(apiDispatch(CREATING_ACCOUNT, true))
        firebase
          .auth()
          .currentUser.getIdToken(/* forceRefresh */ true)
          .then(idToken => {
            // Send token to your backend via HTTPS
            // ...
            const login_data = {
              token: idToken,
              name: name
            }
            apiAuthClient
              .post(login_url, login_data)
              .then(response => {
                let logged_in_user = response.data.user
                dispatch(apiDispatch(CREATING_ACCOUNT, false))
                dispatch(apiDispatch(GET_AUTHENTICATION_STATUS, true))
                dispatch(apiDispatch(GET_LOGGEDINUSER, logged_in_user))
              })
              .catch(error => {
                dispatch(apiDispatch(CREATING_ACCOUNT, false))
                dispatch(apiDispatch(GET_AUTHENTICATION_STATUS, false))
                dispatch(apiError(error))
              })
          })
          .catch(error => {
            dispatch(apiError(error))
          })
        // ...
      })
      .catch(error => {
        dispatch(otpError(error))
      })
  }
}

export const cleanOTP = () =>{
    return dispatch => {
        dispatch(apiDispatch(CLEAN_OTP, {}))
    }
}
