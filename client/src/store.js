import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';
import rootReducer from './reducers';

const middleware = [thunk]
const initalState = {}

const store = createStore(
    rootReducer,
    initalState,
    composeWithDevTools(
        applyMiddleware(...middleware)
    )
);

export default store;