import React from 'react';
import Classes from './button.module.css'
const button = props => {
    switch (props.type) {
        case 'success':
            return <button
                className={Classes.success}
                style={{ display: props.display }}
                onClick={e => props.click(e)}>
                {props.name}
            </button>
        case 'danger':
            return <button
                className={Classes.danger}
                style={{ display: props.display }}
                onClick={e => props.click(e)}>
                {props.name}
            </button>
        default:
            return <button
                className={Classes.default}
                style={{ display: props.display }}
                onClick={e => props.click(e)}>
                {props.name}
            </button>
    }
}

export default button