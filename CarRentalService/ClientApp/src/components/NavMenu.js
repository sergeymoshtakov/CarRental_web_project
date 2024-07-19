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
            isAdmin: false,
        };
    }

    async componentDidMount() {
        const authResponse = await fetch('/account/isAuthenticated', {
            method: 'GET',
            credentials: 'include',
        });

        if (authResponse.ok) {
            this.setState({ isLoggedIn: true });
        } else {
            this.setState({ isLoggedIn: false });
        }

        const adminResponse = await fetch('/account/isAdmin', {
            method: 'GET',
            credentials: 'include',
        });

        if (adminResponse.ok) {
            this.setState({ isAdmin: true });
        } else {
            this.setState({ isAdmin: false });
        }
    }

    toggleNavbar() {
        this.setState({ collapsed: !this.state.collapsed });
    }

    async logout() {
        const response = await fetch('/account/logout', {
            method: 'POST',
            credentials: 'include',
        });

        if (response.ok) {
            this.setState({ isLoggedIn: false });
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
                        <ul className="navbar-nav flex-grow">
                            <NavItem>
                                <NavLink tag={Link} className="menu-link" to="/">Home</NavLink>
                            </NavItem>
                            {this.state.isLoggedIn ? (
                                <>
                                    {this.state.isAdmin ? (
                                        <>
                                            <NavItem>
                                                <NavLink tag={Link} className="menu-link" to="/users">Users</NavLink>
                                            </NavItem>
                                            <NavItem>
                                                <NavLink tag={Link} className="menu-link" to="/cities">Cities</NavLink>
                                            </NavItem>
                                            <NavItem>
                                                <NavLink tag={Link} className="menu-link" to="/countries">Countries</NavLink>
                                            </NavItem>
                                        </>
                                    ) : (
                                        <>
                                            <NavItem>
                                                <NavLink tag={Link} className="menu-link" to="/search-cars">Search Cars</NavLink>
                                            </NavItem>
                                            <NavItem>
                                                <NavLink tag={Link} className="menu-link" to="/my-rentals">My Rentals</NavLink>
                                            </NavItem>
                                        </>
                                    )}
                                    <NavItem>
                                        <NavLink className="menu-link" onClick={this.logout}>Logout</NavLink>
                                    </NavItem>
                                </>
                            ) : (
                                <>
                                    <NavItem>
                                        <NavLink tag={Link} className="menu-link" to="/login">Login</NavLink>
                                    </NavItem>
                                    <NavItem>
                                        <NavLink tag={Link} className="menu-link" to="/register">Register</NavLink>
                                    </NavItem>
                                </>
                            )}
                        </ul>
                    </Collapse>
                </Navbar>
            </header>
        );
    }
}
