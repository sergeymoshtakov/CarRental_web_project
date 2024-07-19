import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'; // Импорт стилей Bootstrap
import { useTranslation } from 'react-i18next';

export function Countries() {
    const { t } = useTranslation();
    const [countries, setCountries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [country, setCountry] = useState({ name: '' });
    const [isEditing, setIsEditing] = useState(false);
    const [countryId, setCountryId] = useState(null);

    useEffect(() => {
        populateCountriesData();
    }, []);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setCountry(prevCountry => ({ ...prevCountry, [name]: value }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
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
            setCountry({ name: '' });
            setIsEditing(false);
            setCountryId(null);
            populateCountriesData();
        }
    };

    const editCountry = async (id) => {
        const response = await fetch(`countries/${id}`);
        const country = await response.json();
        setCountry(country);
        setIsEditing(true);
        setCountryId(id);
    };

    const deleteCountry = async (id) => {
        const response = await fetch(`countries/${id}`, { method: 'DELETE' });
        if (response.ok) {
            populateCountriesData();
        }
    };

    const populateCountriesData = async () => {
        const response = await fetch('countries');
        const data = await response.json();
        setCountries(data);
        setLoading(false);
    };

    const renderCountriesTable = (countries) => {
        return (
            <table className="table table-striped table-bordered">
                <thead className="thead-dark">
                    <tr>
                        <th>{t('name')}</th>
                        <th>{t('actions')}</th>
                    </tr>
                </thead>
                <tbody>
                    {countries.map(country => (
                        <tr key={country.id}>
                            <td>{country.name}</td>
                            <td>
                                <button className="btn btn-warning btn-sm me-2" onClick={() => editCountry(country.id)}>{t('edit')}</button>
                                <button className="btn btn-danger btn-sm" onClick={() => deleteCountry(country.id)}>{t('delete')}</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        );
    };

    return (
        <div className="container mt-4">
            <h1 id="tableLabel" className="mb-4">{t('countries')}</h1>
            <div className="mb-4">
                <h2>{isEditing ? t('editCountry') : t('addCountry')}</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label htmlFor="name" className="form-label">{t('name')}</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            className="form-control"
                            value={country.name}
                            onChange={handleChange}
                            placeholder={t('countryName')}
                            required
                        />
                    </div>
                    <button type="submit" className="btn btn-primary">{isEditing ? t('update') : t('save')}</button>
                </form>
            </div>
            {loading ? <p><em>{t('loading')}</em></p> : renderCountriesTable(countries)}
        </div>
    );
}
