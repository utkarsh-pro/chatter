import React from 'react';
import Classes from './form.module.css'

const form = props => (
    <form className={Classes.Form} style={{ height: props.height, width: props.width, margin: '1rem 0' }}>
        {props.children}
    </form>
);

export default form;