import React, { Component } from 'react';

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
            <table className="table table-striped" aria-labelledby="tableLabel">
                <thead>
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
                                <button onClick={() => editUser(user.userId)}>Edit</button>
                                <button onClick={() => deleteUser(user.userId)}>Delete</button>
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
            <div>
                <h1 id="tableLabel">Users</h1>
                <form onSubmit={this.handleSubmit}>
                    <input type="text" name="name" value={this.state.user.name} onChange={this.handleChange} placeholder="Name" required />
                    <input type="email" name="email" value={this.state.user.email} onChange={this.handleChange} placeholder="Email" required />
                    <input type="password" name="password" value={this.state.user.password} onChange={this.handleChange} placeholder="Password" required />
                    <input type="text" name="phone" value={this.state.user.phone} onChange={this.handleChange} placeholder="Phone" />
                    <input type="text" name="role" value={this.state.user.role} onChange={this.handleChange} placeholder="Role" />
                    <button type="submit">Save</button>
                </form>
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
