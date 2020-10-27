import axios from "axios";
import { Toast } from 'native-base'

const ROOT_API = `https://test.oppwa.com/v1/`

export const buildAcceptHeader = () => ({
  'Content-Type': 'application/json',
  'Accept': 'application/json',
})

export const buildFormUrlAcceptHeader = () => ({
  'Content-Type': 'application/x-www-form-urlencoded',
  'Accept': 'application/json',
})

export const tokenHeader = Token => ({
  'Content-Type': 'application/x-www-form-urlencoded',
  'Accept': 'application/json',
  'Authorization': `Bearer OGFjN2E0Yzk3NTAyOTVhOTAxNzUwMzQ1OTdkZDAzM2N8Y244azc5V3gzNQ==`
})

export const multiPartHeader = Token => ({
  'Content-Type': 'multipart/form_data',
  'Accept': 'application/json',
  'Authorization': `Bearer OGFjN2E0Yzk3NTAyOTVhOTAxNzUwMzQ1OTdkZDAzM2N8Y244azc5V3gzNQ`
})

const buildURL = (path) => {
  console.log('@URL', ROOT_API + path)
  return ROOT_API + path
}

const errorMsg = (msg) => Toast.show({
  text: msg,
  buttonText: 'OK',
  type: 'danger',
  duration: 5000,
})

export const getRequest = (path, config) => axios
  .get(buildURL(path), config)
  .then(({ data }) => data)
  .catch(e => {
    console.log('ERROR', e.response.data, config, path)
    // errorMsg('Something Went Wrong')
    return e.response.data
  })

export const postRequest = (path, body, config) => axios
  .post(buildURL(path), body, config)
  .then(({ data }) => data)
  .catch(e => {
    console.log('ERROR', e.response.data, path, body)
    // errorMsg('Something Went Wrong')
    return e.response.data
  })

export const putRequest = (path, body, config) => axios
  .put(buildURL(path), body, config)
  .then(({ data }) => data)
  .catch(e => {
    console.log('ERROR', e.response.data, path)
    // errorMsg('Something Went Wrong')
    return e.response.data
  })

export const patchRequest = (path, body, config) => axios
  .patch(buildURL(path), body, config)
  .then(({ data }) => data)
  .catch(e => {
    console.log('ERROR', e.response.data.messsage, path)
    // errorMsg('Something Went Wrong')
    return e.response.data
  })

export const deleteRequest = (path, config) => axios
  .delete(buildURL(path), config)
  .then(({ data }) => data)
  .catch(e => {
    console.log('ERROR', e.response.data.messsage, path)
    // errorMsg('Something Went Wrong')
    return e.response.data
  })