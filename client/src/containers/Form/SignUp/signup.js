import React from 'react';
import propTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import Classes from './signup.module.css';
import Input from '../../../components/UI/Input/input';
import Button from '../../../components/UI/Button/button';
import Form from '../form';
import { registerUser } from '../../../actions/authActions';

class SignUp extends React.Component {
    state = {
        username: '',
        password: '',
        password2: '',
        match: true
    }

    componentDidMount() {
        if (this.props.auth.isAuthenticated) {
            this.props.history.push('/chatter');
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.errors)
            console.log('OH MY GOD!!')
    }

    submit = e => {
        e.preventDefault();
        if (this.state.match)
            this.props.registerUser({
                username: this.state.username,
                password: this.state.password
            }, this.props.history);
    }

    inputCheck = () => {
        if (this.state.password !== this.state.password2) {
            this.setState({ match: false })
        }
        else {
            this.setState({ match: true })
        }
    }

    save = (text, type) => {
        // Callback function will ensure that
        // function call is made only after
        // setState has finished updating the state
        this.setState({ [type]: text }, () => {
            if (type === 'password2')
                this.inputCheck();
        });
    }

    render() {
        return (
            <div className={Classes.placeForm}>
                <Form height='32rem' width='20vw' >
                    <Helmet>
                        <title>SignUp</title>
                    </Helmet>
                    {this.state.match ? null :
                        <div className={Classes.flash}>Passwords don't match</div>
                    }
                    <h2>Sign Up</h2>
                    <div
                        style={{ fontSize: '1rem', margin: '-0.5rem 0 1.5rem 0' }}>
                        And enjoy our exclusive chat service for free!
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
                    <Input
                        type='password'
                        name='password2'
                        label='Confirm Password'
                        press={this.save} />
                    <div>
                        <Link
                            to='/'
                            style={{ textDecoration: 'none' }}>
                            Already have an account?
                        </Link>
                    </div>
                    <Button name='Sign Up' type='success' click={this.submit} />
                </Form>
            </div>
        )
    }
};

SignUp.propTypes = {
    registerUser: propTypes.func.isRequired,
    auth: propTypes.object.isRequired
}

const mapStateToProps = state => ({
    auth: state.auth,
    errors: state.errors
});

export default connect(mapStateToProps, { registerUser })(withRouter(SignUp));
