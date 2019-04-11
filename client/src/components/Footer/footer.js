import React from "react";
import Classes from './footer.module.css';

const footer = props => {
    return (
        <footer className={Classes.footer}>
            <p>Property of Utkarsh Srivastava &copy; {new Date().getFullYear()}</p>
        </footer>
    )
};

export default footer;