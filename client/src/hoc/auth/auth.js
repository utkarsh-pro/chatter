import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
class Auth extends Component {
    constructor() {
        super();
        this.state = {
            loading: true,
            redirect: false,
        };
    }
    componentDidMount() {
        fetch('/checkToken', {
            headers: {
                Authorization: JSON.parse(localStorage.getItem('jwt'))
            }
        }).then(res => {
            if (res.status === 200) {
                this.setState({ loading: false });
            } else {
                const error = new Error(res.error);
                throw error;
            }
        })
            .catch(err => {
                console.error(err);
                this.setState({ loading: false, redirect: true });
            });
    }
    render() {
        const { loading, redirect } = this.state;
        if (loading) {
            return null;
        }
        if (redirect) {
            return <Redirect to="/" />;
        }
        return (
            <React.Fragment>
                {this.props.children}
            </React.Fragment>
        );
    }
}

export default Auth;
