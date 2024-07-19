import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useTranslation } from 'react-i18next';

export function Users() {
    const { t } = useTranslation();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState({ name: '', email: '', phone: '', role: '', password: '' });
    const [isEditing, setIsEditing] = useState(false);
    const [userId, setUserId] = useState(null);

    useEffect(() => {
        populateUsersData();
    }, []);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setUser(prevUser => ({ ...prevUser, [name]: value }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const response = isEditing
            ? await fetch(`users/${userId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(user)
            })
            : await fetch('users', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(user)
            });

        if (response.ok) {
            setUser({ name: '', email: '', phone: '', role: '', password: '' });
            setIsEditing(false);
            setUserId(null);
            populateUsersData();
        }
    };

    const editUser = async (id) => {
        const response = await fetch(`users/${id}`);
        const user = await response.json();
        setUser(user);
        setIsEditing(true);
        setUserId(id);
    };

    const deleteUser = async (id) => {
        const response = await fetch(`users/${id}`, { method: 'DELETE' });
        if (response.ok) {
            populateUsersData();
        }
    };

    const populateUsersData = async () => {
        const response = await fetch('users');
        const data = await response.json();
        setUsers(data);
        setLoading(false);
    };

    const renderUsersTable = (users) => {
        return (
            <table className="table table-striped table-bordered">
                <thead className="thead-dark">
                    <tr>
                        <th>{t('name')}</th>
                        <th>{t('email')}</th>
                        <th>{t('phone')}</th>
                        <th>{t('role')}</th>
                        <th>{t('actions')}</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map(user => (
                        <tr key={user.userId}>
                            <td>{user.name}</td>
                            <td>{user.email}</td>
                            <td>{user.phone}</td>
                            <td>{user.role}</td>
                            <td>
                                <button className="btn btn-warning btn-sm me-2" onClick={() => editUser(user.userId)}>{t('edit')}</button>
                                <button className="btn btn-danger btn-sm" onClick={() => deleteUser(user.userId)}>{t('delete')}</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        );
    };

    return (
        <div className="container mt-4">
            <h1 id="tableLabel" className="mb-4">{t('users')}</h1>

            <div className="mb-4">
                <h2>{isEditing ? t('editUser') : t('addUser')}</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label htmlFor="name" className="form-label">{t('name')}</label>
                        <input type="text" id="name" name="name" className="form-control" value={user.name} onChange={handleChange} placeholder={t('name')} required />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="email" className="form-label">{t('email')}</label>
                        <input type="email" id="email" name="email" className="form-control" value={user.email} onChange={handleChange} placeholder={t('email')} required />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="password" className="form-label">{t('password')}</label>
                        <input type="password" id="password" name="password" className="form-control" value={user.password} onChange={handleChange} placeholder={t('password')} required />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="phone" className="form-label">{t('phone')}</label>
                        <input type="text" id="phone" name="phone" className="form-control" value={user.phone} onChange={handleChange} placeholder={t('phone')} />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="role" className="form-label">{t('role')}</label>
                        <input type="text" id="role" name="role" className="form-control" value={user.role} onChange={handleChange} placeholder={t('role')} />
                    </div>
                    <button type="submit" className="btn btn-primary">{isEditing ? t('update') : t('save')}</button>
                </form>
            </div>

            {loading ? <p><em>{t('loading')}</em></p> : renderUsersTable(users)}
        </div>
    );
}
