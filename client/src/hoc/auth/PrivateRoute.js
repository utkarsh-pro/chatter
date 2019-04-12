import React from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

export default (ComposedComponent) => {
    class PrivateRoute extends React.Component {
        componentWillMount() {
            if (!this.props.auth.isAuthenticated) {
                this.props.history.push('/');
            }
        }
        render() {
            return (
                <ComposedComponent {...this.props} />
            )
        }
    }
    const mapStateToProps = (state) => ({
        auth: state.auth,
    });
    return connect(mapStateToProps)(withRouter(PrivateRoute));
}