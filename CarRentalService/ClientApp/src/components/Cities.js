import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useTranslation } from 'react-i18next';

export function Cities() {
    const { t } = useTranslation();
    const [cities, setCities] = useState([]);
    const [countries, setCountries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [city, setCity] = useState({ name: '', countryId: '' });
    const [isEditing, setIsEditing] = useState(false);
    const [cityId, setCityId] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchCities();
        fetchCountries();
    }, []);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setCity(prevCity => ({
            ...prevCity,
            [name]: value
        }));
        setError(null);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!city.countryId) {
            setError(t('countryRequired'));
            return;
        }

        try {
            const url = isEditing ? `/cities/${cityId}` : '/cities';
            const method = isEditing ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: city.name, countryId: city.countryId })
            });

            if (!response.ok) {
                const errorMessage = await response.json();
                throw new Error(`HTTP error! Status: ${response.status}, Message: ${JSON.stringify(errorMessage)}`);
            }

            setCity({ name: '', countryId: '' });
            setIsEditing(false);
            setCityId(null);
            setError(null);
            fetchCities();
        } catch (error) {
            console.error('Error:', error);
            setError(error.message);
        }
    };

    const editCity = async (id) => {
        try {
            const response = await fetch(`/cities/${id}`);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const city = await response.json();
            setCity({ name: city.name, countryId: city.countryId });
            setIsEditing(true);
            setCityId(id);
            setError(null);
        } catch (error) {
            console.error('Error:', error);
            setError(error.message);
        }
    };

    const deleteCity = async (id) => {
        try {
            const response = await fetch(`/cities/${id}`, { method: 'DELETE' });
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            fetchCities();
        } catch (error) {
            console.error('Error:', error);
            setError(error.message);
        }
    };

    const fetchCities = async (countryId = '') => {
        try {
            const url = countryId ? `/cities?countryId=${countryId}` : '/cities';
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data = await response.json();
            setCities(data);
            setLoading(false);
            setError(null);
        } catch (error) {
            console.error('Error:', error);
            setError(error.message);
        }
    };

    const fetchCountries = async () => {
        try {
            const response = await fetch('/countries');
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data = await response.json();
            setCountries(data);
            setError(null);
        } catch (error) {
            console.error('Error:', error);
            setError(error.message);
        }
    };

    const renderCitiesTable = (cities) => {
        return (
            <table className="table table-striped table-bordered">
                <thead className="thead-dark">
                    <tr>
                        <th>{t('name')}</th>
                        <th>{t('country')}</th>
                        <th>{t('actions')}</th>
                    </tr>
                </thead>
                <tbody>
                    {cities.map(city => (
                        <tr key={city.id}>
                            <td>{city.name}</td>
                            <td>{city.country ? city.country.name : t('unknown')}</td>
                            <td>
                                <button className="btn btn-warning btn-sm me-2" onClick={() => editCity(city.id)}>{t('edit')}</button>
                                <button className="btn btn-danger btn-sm" onClick={() => deleteCity(city.id)}>{t('delete')}</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        );
    };

    return (
        <div className="container mt-4">
            <h1 id="tableLabel" className="mb-4">{t('cities')}</h1>
            {error && <div className="alert alert-danger">{error}</div>}
            <div className="mb-4">
                <h2>{isEditing ? t('editCity') : t('addCity')}</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label htmlFor="name" className="form-label">{t('name')}</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            className="form-control"
                            value={city.name}
                            onChange={handleChange}
                            placeholder={t('cityName')}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="countryId" className="form-label">{t('country')}</label>
                        <select
                            id="countryId"
                            name="countryId"
                            className="form-select"
                            value={city.countryId}
                            onChange={handleChange}
                            required
                        >
                            <option value="">{t('select-country')}</option>
                            {countries.map(country => (
                                <option key={country.id} value={country.id}>
                                    {country.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <button type="submit" className="btn btn-primary">{isEditing ? t('update') : t('save')}</button>
                </form>
            </div>
            {loading ? <p><em>{t('loading')}</em></p> : renderCitiesTable(cities)}
        </div>
    );
}
