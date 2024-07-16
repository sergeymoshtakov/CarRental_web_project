import React, { Component } from 'react';
import { Collapse, Navbar, NavbarBrand, NavbarToggler, NavItem, NavLink } from 'reactstrap';
import { Link } from 'react-router-dom';
import './NavMenu.css';

export class NavMenu extends Component {
    static displayName = NavMenu.name;

    constructor(props) {
        super(props);

        this.toggleNavbar = this.toggleNavbar.bind(this);
        this.logout = this.logout.bind(this);
        this.state = {
            collapsed: true,
            isLoggedIn: false,
        };
    }

    async componentDidMount() {
        const response = await fetch('/account/isAuthenticated', {
            method: 'GET',
            credentials: 'include',
        });

        if (response.ok) {
            this.setState({
                isLoggedIn: true
            });
        } else {
            this.setState({
                isLoggedIn: false
            });
        }
    }

    toggleNavbar() {
        this.setState({
            collapsed: !this.state.collapsed
        });
    }

    async logout() {
        const response = await fetch('/account/logout', {
            method: 'POST',
            credentials: 'include',
        });

        if (response.ok) {
            this.setState({
                isLoggedIn: false
            });
            window.location.href = '/login';
        } else {
            console.error('Failed to logout');
        }
    }

    render() {
        return (
            <header>
                <Navbar className="navbar-expand-sm navbar-toggleable-sm ng-white border-bottom box-shadow mb-3" container="true" light>
                    <NavbarToggler onClick={this.toggleNavbar} className="mr-2" />
                    <Collapse className="d-sm-inline-flex flex-sm-row-reverse" isOpen={!this.state.collapsed} navbar>
                        {this.state.isLoggedIn ? (
                            <ul className="navbar-nav flex-grow">
                                <NavItem>
                                    <NavLink tag={Link} className="text-dark" to="/">Home</NavLink>
                                </NavItem>
                                <NavItem>
                                    <NavLink tag={Link} className="text-dark" to="/users">Users</NavLink>
                                </NavItem>
                                <NavItem>
                                    <NavLink className="text-dark" onClick={this.logout}>Logout</NavLink>
                                </NavItem>
                            </ul>
                        ) : (
                            <ul className="navbar-nav flex-grow">
                                <NavItem>
                                    <NavLink tag={Link} className="text-dark" to="/">Home</NavLink>
                                </NavItem>
                                <NavItem>
                                    <NavLink tag={Link} className="text-dark" to="/login">Login</NavLink>
                                </NavItem>
                                <NavItem>
                                    <NavLink tag={Link} className="text-dark" to="/register">Register</NavLink>
                                </NavItem>
                            </ul>
                        )}
                    </Collapse>
                </Navbar>
            </header>
        );
    }
}
