import React, { Component } from 'react';

export class Countries extends Component {
    static displayName = Countries.name;

    constructor(props) {
        super(props);
        this.state = {
            countries: [],
            loading: true,
            country: { name: '' },
            isEditing: false,
            countryId: null
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.editCountry = this.editCountry.bind(this);
        this.deleteCountry = this.deleteCountry.bind(this);
    }

    componentDidMount() {
        this.populateCountriesData();
    }

    static renderCountriesTable(countries, editCountry, deleteCountry) {
        return (
            <table className="table table-striped" aria-labelledby="tableLabel">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {countries.map(country => (
                        <tr key={country.id}>
                            <td>{country.name}</td>
                            <td>
                                <button onClick={() => editCountry(country.id)}>Edit</button>
                                <button onClick={() => deleteCountry(country.id)}>Delete</button>
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
            country: { ...prevState.country, [name]: value }
        }));
    }

    async handleSubmit(event) {
        event.preventDefault();
        const { country, isEditing, countryId } = this.state;
        const response = isEditing
            ? await fetch(`countries/${countryId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(country)
            })
            : await fetch('countries', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(country)
            });

        if (response.ok) {
            this.setState({ country: { name: '' }, isEditing: false, countryId: null });
            this.populateCountriesData();
        }
    }

    async editCountry(id) {
        const response = await fetch(`countries/${id}`);
        const country = await response.json();
        this.setState({ country, isEditing: true, countryId: id });
    }

    async deleteCountry(id) {
        const response = await fetch(`countries/${id}`, { method: 'DELETE' });
        if (response.ok) {
            this.populateCountriesData();
        }
    }

    render() {
        let contents = this.state.loading
            ? <p><em>Loading...</em></p>
            : Countries.renderCountriesTable(this.state.countries, this.editCountry, this.deleteCountry);

        return (
            <div>
                <h1 id="tableLabel">Countries</h1>
                <form onSubmit={this.handleSubmit}>
                    <input type="text" name="name" value={this.state.country.name} onChange={this.handleChange} placeholder="Name" required />
                    <button type="submit">Save</button>
                </form>
                {contents}
            </div>
        );
    }

    async populateCountriesData() {
        const response = await fetch('countries');
        const data = await response.json();
        this.setState({ countries: data, loading: false });
    }
}
