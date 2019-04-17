import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import rootReducer from './reducers';

const middleware = [thunk]
const initalState = {}

const store = createStore(
    rootReducer,
    initalState,
    compose(
        applyMiddleware(...middleware),
        // REDUX DEVEOPER TOOL - TO BE ENABLED ONLY IN DEVELOPMENT MODE
        //window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
    )
);

export default store;