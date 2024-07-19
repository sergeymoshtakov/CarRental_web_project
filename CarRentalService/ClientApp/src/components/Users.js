import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'; // Импорт стилей Bootstrap

export class Users extends Component {
    static displayName = Users.name;

    constructor(props) {
        super(props);
        this.state = {
            users: [],
            loading: true,
            user: { name: '', email: '', phone: '', role: '', password: '' },
            isEditing: false,
            userId: null
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.editUser = this.editUser.bind(this);
        this.deleteUser = this.deleteUser.bind(this);
    }

    componentDidMount() {
        this.populateUsersData();
    }

    static renderUsersTable(users, editUser, deleteUser) {
        return (
            <table className="table table-striped table-bordered">
                <thead className="thead-dark">
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>Role</th>
                        <th>Actions</th>
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
                                <button className="btn btn-warning btn-sm me-2" onClick={() => editUser(user.userId)}>Edit</button>
                                <button className="btn btn-danger btn-sm" onClick={() => deleteUser(user.userId)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        );
    }

    handleChange(event) {
        const { name, value } = event.target;
        this.setState(prevState => ({
            user: { ...prevState.user, [name]: value }
        }));
    }

    async handleSubmit(event) {
        event.preventDefault();
        const { user, isEditing, userId } = this.state;
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
            this.setState({ user: { name: '', email: '', phone: '', role: '', password: '' }, isEditing: false, userId: null });
            this.populateUsersData();
        }
    }

    async editUser(id) {
        const response = await fetch(`users/${id}`);
        const user = await response.json();
        this.setState({ user, isEditing: true, userId: id });
    }

    async deleteUser(id) {
        const response = await fetch(`users/${id}`, { method: 'DELETE' });
        if (response.ok) {
            this.populateUsersData();
        }
    }

    render() {
        let contents = this.state.loading
            ? <p><em>Loading...</em></p>
            : Users.renderUsersTable(this.state.users, this.editUser, this.deleteUser);

        return (
            <div className="container mt-4">
                <h1 id="tableLabel" className="mb-4">Users</h1>

                <div className="mb-4">
                    <h2>{this.state.isEditing ? 'Edit User' : 'Add User'}</h2>
                    <form onSubmit={this.handleSubmit}>
                        <div className="mb-3">
                            <label htmlFor="name" className="form-label">Name</label>
                            <input type="text" id="name" name="name" className="form-control" value={this.state.user.name} onChange={this.handleChange} placeholder="Name" required />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="email" className="form-label">Email</label>
                            <input type="email" id="email" name="email" className="form-control" value={this.state.user.email} onChange={this.handleChange} placeholder="Email" required />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="password" className="form-label">Password</label>
                            <input type="password" id="password" name="password" className="form-control" value={this.state.user.password} onChange={this.handleChange} placeholder="Password" required />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="phone" className="form-label">Phone</label>
                            <input type="text" id="phone" name="phone" className="form-control" value={this.state.user.phone} onChange={this.handleChange} placeholder="Phone" />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="role" className="form-label">Role</label>
                            <input type="text" id="role" name="role" className="form-control" value={this.state.user.role} onChange={this.handleChange} placeholder="Role" />
                        </div>
                        <button type="submit" className="btn btn-primary">{this.state.isEditing ? 'Update' : 'Save'}</button>
                    </form>
                </div>

                {contents}
            </div>
        );
    }

    async populateUsersData() {
        const response = await fetch('users');
        const data = await response.json();
        this.setState({ users: data, loading: false });
    }
}
