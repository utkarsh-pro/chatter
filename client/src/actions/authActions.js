import axios from 'axios';
import jwt_decode from 'jwt-decode';
import { GET_ERRORS, SET_CURRENT_USER } from './types';
import setAuthToken from '../utils/setAuthToken';

// REGISTER USER
export const registerUser = (userData, history) => dispatch => {
    axios.post('/api/sign-up', userData)
        .then(res => history.push('/'))
        .catch(err => dispatch({
            type: GET_ERRORS,
            payload: err.response.data
        }))
}

// LOGIN USER
export const loginUser = userData => dispatch => {
    axios.post('/api/login', userData)
        .then(res => {
            // Save to local storage
            console.log(res.data);
            const token = res.data.token;
            // Set token to local storage
            localStorage.setItem('jwt', token);
            // Set taken to auth header
            setAuthToken(token);
            // Decode token to get user data
            const decoded = jwt_decode(token);
            // Set current user
            dispatch(setCurrentUser(decoded))
        })
        .catch(err => {
            dispatch({
                type: GET_ERRORS,
                payload: err.response.data
            })
        })
}

// Set Logged in user 
export const setCurrentUser = decoded => {
    return {
        type: SET_CURRENT_USER,
        payload: decoded
    }
}

// Log user out
export const logoutUser = () => dispatch => {
    // Remove token from local storage
    localStorage.removeItem('jwt');
    // Remove the auth header for future requests
    setAuthToken(false);
    // Set current user to {} which will set isAuthenticated to false
    dispatch(setCurrentUser({}));
}