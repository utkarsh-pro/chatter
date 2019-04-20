import React from 'react';
import Classes from './input.module.css';

const input = props => (
    <div style={{ display: props.display, width: props.width, marginRight: props.marginRight }}>
        <label htmlFor={props.name} className={Classes.for}>{props.label}
            <input
                ref={props.refs ? props.refs : null}
                type={props.type}
                value={props.message}
                className={Classes.Input}
                name={props.name}
                autoComplete='off'
                disabled={props.active === false ? true : false}
                onChange={e => props.press ? props.press(e, props.name) : null}
            />
        </label>
    </div>
);

export default input;