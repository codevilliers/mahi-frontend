import axios from 'axios'
import getCookie from '../utils/get_cookie'
import {api_base_url} from '../urls'

export const apiAuthClient = axios.create({
  baseURL: `${api_base_url}auth/`,
  withCredentials: true,
  headers: {
    'X-CSRFToken': getCookie('mahi_csrftoken'),
    'Content-Type': 'application/json'
  }
})

export const apiClient = axios.create({
  baseURL: `${api_base_url}mahi_app/`,
  withCredentials: true,
  headers: {
    'X-CSRFToken': getCookie('mahi_csrftoken'),
    'Content-Type': 'application/json'
  }
})
