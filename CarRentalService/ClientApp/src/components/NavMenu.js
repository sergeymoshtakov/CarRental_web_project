import React, { useState, useEffect } from 'react';
import { Collapse, Navbar, NavbarToggler, NavItem, NavLink } from 'reactstrap';
import { Link } from 'react-router-dom';
import LanguageSwitcher from './LanguageSwitcher';
import { useTranslation } from 'react-i18next';
import './NavMenu.css';

export function NavMenu(){
    const { t } = useTranslation();
    const [collapsed, setCollapsed] = useState(true);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);

    const toggleNavbar = () => setCollapsed(!collapsed);

    const logout = async () => {
        const response = await fetch('/account/logout', {
            method: 'POST',
            credentials: 'include',
        });

        if (response.ok) {
            setIsLoggedIn(false);
            window.location.href = '/login';
        } else {
            console.error('Failed to logout');
        }
    };

    useEffect(() => {
        const checkAuth = async () => {
            const authResponse = await fetch('/account/isAuthenticated', {
                method: 'GET',
                credentials: 'include',
            });

            if (authResponse.ok) {
                setIsLoggedIn(true);
            } else {
                setIsLoggedIn(false);
            }

            const adminResponse = await fetch('/account/isAdmin', {
                method: 'GET',
                credentials: 'include',
            });

            if (adminResponse.ok) {
                setIsAdmin(true);
            } else {
                setIsAdmin(false);
            }
        };

        checkAuth();
    }, []);

    return (
        <header>
            <Navbar className="navbar-expand-sm navbar-toggleable-sm ng-white border-bottom box-shadow mb-3" container="true" light>
                <NavbarToggler onClick={toggleNavbar} className="mr-2" />
                <Collapse className="d-sm-inline-flex flex-sm-row-reverse" isOpen={!collapsed} navbar>
                    <ul className="navbar-nav flex-grow">
                        <NavItem>
                            <NavLink tag={Link} className="menu-link" to="/">{t('home')}</NavLink>
                        </NavItem>
                        {isLoggedIn ? (
                            <>
                                {isAdmin ? (
                                    <>
                                        <NavItem>
                                            <NavLink tag={Link} className="menu-link" to="/users">{t('users')}</NavLink>
                                        </NavItem>
                                        <NavItem>
                                            <NavLink tag={Link} className="menu-link" to="/cities">{t('cities')}</NavLink>
                                        </NavItem>
                                        <NavItem>
                                            <NavLink tag={Link} className="menu-link" to="/countries">{t('countries')}</NavLink>
                                        </NavItem>
                                        <NavItem>
                                            <NavLink tag={Link} className="menu-link" to="/cars">{t('cars')}</NavLink>
                                        </NavItem>
                                    </>
                                ) : (
                                    <>
                                        <NavItem>
                                            <NavLink tag={Link} className="menu-link" to="/search-cars">{t('searchCar')}</NavLink>
                                        </NavItem>
                                        <NavItem>
                                            <NavLink tag={Link} className="menu-link" to="/my-rentals">{t('myRentals')}</NavLink>
                                        </NavItem>
                                        <NavItem>
                                            <NavLink tag={Link} className="menu-link" to="/user-statistics">{t('my-statistics')}</NavLink>
                                        </NavItem>
                                    </>
                                )}
                                <NavItem>
                                    <NavLink className="menu-link" onClick={logout}>{t('logout')}</NavLink>
                                </NavItem>
                            </>
                        ) : (
                            <>
                                <NavItem>
                                    <NavLink tag={Link} className="menu-link" to="/login">{t('login')}</NavLink>
                                </NavItem>
                                <NavItem>
                                    <NavLink tag={Link} className="menu-link" to="/register">{t('register')}</NavLink>
                                </NavItem>
                            </>
                        )}
                        <LanguageSwitcher />
                    </ul>
                </Collapse>
            </Navbar>
        </header>
    );
};
