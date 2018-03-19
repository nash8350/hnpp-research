import React from 'react';
import Link from 'gatsby-link';

import github from '../img/github-icon.svg';

const Navbar = () => (
  <nav className="navbar is-transparent">
    <div className="container">
      <div className="navbar-brand">
        <Link to="/research" className="navbar-item">
          <p className="logo">HNPP Research</p>
        </Link>
      </div>
      <div className="navbar-start">
        <Link className="navbar-item" to="/research">
          Research Explorer
        </Link>
        <Link className="navbar-item" to="/about">
          About
        </Link>
      </div>
      <div className="navbar-end">
        <a className="navbar-item" href="https://github.com/nash8350/hnpp-research-gatsby/" target="_blank" rel="noopener noreferrer">
          <span className="icon">
            <img src={github} alt="Github" />
          </span>
        </a>
      </div>
    </div>
  </nav>
);

export default Navbar;
