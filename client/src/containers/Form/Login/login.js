import React from 'react';
import { Helmet } from 'react-helmet';
import { Link, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { loginUser } from '../../../actions/authActions';
import Classes from './login.module.css';
import Input from '../../../components/UI/Input/input';
import Button from '../../../components/UI/Button/button';
import Form from '../form';

class Login extends React.Component {
    state = {
        username: '',
        password: '',
        auth: false
    }

    componentDidMount() {
        if (this.props.auth.isAuthenticated) {
            this.props.history.push('/chatter');
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.auth.isAuthenticated) {
            this.props.history.push('/chatter');
        }

        if (nextProps.errors) {
            console.log(nextProps.errors);
        }
    }
    // Submit button handler
    submit = e => {
        e.preventDefault();
        this.props.loginUser({
            username: this.state.username,
            password: this.state.password
        })
    }

    // Saves form info into the state
    save = (e, type) => {
        this.setState({ [type]: e.target.value });
    }

    render() {
        return (
            <div className={Classes.placeForm}>
                <div className={Classes.image}>
                    <div className={Classes.Welcome}>
                        Welcome to the chatter.<br /> Connect to your friends around the globe.
                    </div>
                </div>
                <Form height='30rem' width='80%' >
                    <Helmet>
                        <title>Login</title>
                    </Helmet>
                    <h2>Log In</h2>
                    <div
                        style={{ fontSize: '1rem', margin: '-0.5rem 0 1.5rem 0' }}>
                        to continue to the Chatter app
                    </div>
                    <Input
                        type='text'
                        name='username'
                        label='Username'
                        press={this.save} />
                    <Input
                        type='password'
                        name='password'
                        label='Password'
                        press={this.save} />
                    <div>
                        <Link
                            to='/sign-up'
                            style={{ textDecoration: 'none' }}>
                            Don't have an account yet?
                        </Link>
                    </div>
                    <Button name='Login' click={this.submit} />
                    {this.state.auth ? <Redirect to='/chatter' /> : null}
                </Form>
            </div >
        )
    }
};

const mapStateToProps = state => ({
    auth: state.auth,
    errors: state.errors
})

export default connect(mapStateToProps, { loginUser })(Login);
