import React from 'react';
import Classes from './input.module.css';

const input = props => (
    <div style={{ display: props.display, width: props.width, marginRight: props.marginRight }}>
        <label htmlFor={props.name} className={Classes.for}>{props.label}</label>
        <input
            type={props.type}
            className={Classes.Input}
            name={props.name}
            onChange={e => props.press ? props.press(e.target.value, props.name) : null}
        />
    </div>
);

export default input;