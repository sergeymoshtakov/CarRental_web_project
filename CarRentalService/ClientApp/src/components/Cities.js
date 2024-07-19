﻿import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'; // Импорт стилей Bootstrap

export class Cities extends Component {
    constructor(props) {
        super(props);
        this.state = {
            cities: [],
            countries: [],
            loading: true,
            city: { name: '', countryId: '' },
            isEditing: false,
            cityId: null,
            error: null
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.editCity = this.editCity.bind(this);
        this.deleteCity = this.deleteCity.bind(this);
    }

    componentDidMount() {
        this.populateCitiesData();
        this.populateCountriesData();
    }

    static renderCitiesTable(cities, editCity, deleteCity) {
        return (
            <table className="table table-striped table-bordered">
                <thead className="thead-dark">
                    <tr>
                        <th>Name</th>
                        <th>Country</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {cities.map(city => (
                        <tr key={city.id}>
                            <td>{city.name}</td>
                            <td>{city.country ? city.country.name : 'Unknown'}</td>
                            <td>
                                <button className="btn btn-warning btn-sm me-2" onClick={() => editCity(city.id)}>Edit</button>
                                <button className="btn btn-danger btn-sm" onClick={() => deleteCity(city.id)}>Delete</button>
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
            city: {
                ...prevState.city,
                [name]: value
            },
            error: null
        }));
    }

    async handleSubmit(event) {
        event.preventDefault();
        const { city, isEditing, cityId } = this.state;

        if (!city.countryId) {
            this.setState({ error: 'Country is required.' });
            return;
        }

        try {
            const url = isEditing ? `cities/${cityId}` : 'cities';
            const method = isEditing ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(city)
            });

            if (!response.ok) {
                const errorMessage = await response.json();
                throw new Error(`HTTP error! Status: ${response.status}, Message: ${JSON.stringify(errorMessage)}`);
            }

            this.setState({ city: { name: '', countryId: '' }, isEditing: false, cityId: null, error: null });
            this.populateCitiesData();
        } catch (error) {
            console.error('Error:', error);
            this.setState({ error: error.message });
        }
    }

    async editCity(id) {
        try {
            const response = await fetch(`cities/${id}`);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const city = await response.json();
            this.setState({ city, isEditing: true, cityId: id, error: null });
        } catch (error) {
            console.error('Error:', error);
            this.setState({ error: error.message });
        }
    }

    async deleteCity(id) {
        try {
            const response = await fetch(`cities/${id}`, { method: 'DELETE' });
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            this.populateCitiesData();
        } catch (error) {
            console.error('Error:', error);
            this.setState({ error: error.message });
        }
    }

    render() {
        const { loading, cities, countries, city, error } = this.state;

        let contents = loading ? (
            <p><em>Loading...</em></p>
        ) : (
            Cities.renderCitiesTable(cities, this.editCity, this.deleteCity)
        );

        return (
            <div className="container mt-4">
                <h1 id="tableLabel" className="mb-4">Cities</h1>
                {error && <div className="alert alert-danger">{error}</div>}
                <div className="mb-4">
                    <h2>{this.state.isEditing ? 'Edit City' : 'Add City'}</h2>
                    <form onSubmit={this.handleSubmit}>
                        <div className="mb-3">
                            <label htmlFor="name" className="form-label">Name</label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                className="form-control"
                                value={city.name}
                                onChange={this.handleChange}
                                placeholder="City Name"
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="countryId" className="form-label">Country</label>
                            <select
                                id="countryId"
                                name="countryId"
                                className="form-select"
                                value={city.countryId}
                                onChange={this.handleChange}
                                required
                            >
                                <option value="">Select Country</option>
                                {countries.map(country => (
                                    <option key={country.id} value={country.id}>
                                        {country.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <button type="submit" className="btn btn-primary">{this.state.isEditing ? 'Update' : 'Save'}</button>
                    </form>
                </div>
                {contents}
            </div>
        );
    }

    async populateCitiesData() {
        try {
            const response = await fetch('cities');
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data = await response.json();
            this.setState({ cities: data, loading: false, error: null });
        } catch (error) {
            console.error('Error:', error);
            this.setState({ error: error.message });
        }
    }

    async populateCountriesData() {
        try {
            const response = await fetch('countries');
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data = await response.json();
            this.setState({ countries: data, error: null });
        } catch (error) {
            console.error('Error:', error);
            this.setState({ error: error.message });
        }
    }
}
