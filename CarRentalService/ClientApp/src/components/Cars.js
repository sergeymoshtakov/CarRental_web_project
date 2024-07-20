import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import 'bootstrap/dist/css/bootstrap.min.css';

export function Cars() {
    const { t } = useTranslation();
    const [cars, setCars] = useState([]);
    const [cities, setCities] = useState([]);
    const [car, setCar] = useState({ make: '', model: '', year: '', licensePlate: '', pricePerDay: '', cityId: '' });
    const [isEditing, setIsEditing] = useState(false);
    const [carId, setCarId] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchCars();
        fetchCities();
    }, []);

    const fetchCars = async () => {
        try {
            const response = await fetch('/cars');
            if (!response.ok) throw new Error('Failed to fetch cars');
            const data = await response.json();
            setCars(data);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const fetchCities = async () => {
        try {
            const response = await fetch('/cities');
            if (!response.ok) throw new Error('Failed to fetch cities');
            const data = await response.json();
            setCities(data);
        } catch (error) {
            setError(error.message);
        }
    };

    const handleChange = (event) => {
        const { name, value } = event.target;
        setCar({ ...car, [name]: value });
        setError(null);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!car.cityId) {
            setError('City is required.');
            return;
        }

        const carToUpdate = { ...car };
        if (carToUpdate.pricePerDay) carToUpdate.pricePerDay = parseFloat(carToUpdate.pricePerDay).toFixed(2);

        console.log('Updating car with data:', carToUpdate); 

        try {
            const url = isEditing ? `/cars/${carId}` : '/cars';
            const method = isEditing ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(carToUpdate),
            });

            if (!response.ok) {
                const errorMessage = await response.json();
                throw new Error(`HTTP error! Status: ${response.status}, Message: ${JSON.stringify(errorMessage)}`);
            }

            setCar({ make: '', model: '', year: '', licensePlate: '', pricePerDay: '', cityId: '' });
            setIsEditing(false);
            setCarId(null);
            fetchCars();
        } catch (error) {
            setError(error.message);
        }
    };

    const editCar = async (id) => {
        try {
            const response = await fetch(`/cars/${id}`);
            if (!response.ok) throw new Error('Failed to fetch car');
            const carData = await response.json();
            setCar({ ...carData, cityId: carData.city ? carData.city.id : '' });
            setIsEditing(true);
            setCarId(id);
            setError(null);
        } catch (error) {
            setError(error.message);
        }
    };

    const deleteCar = async (id) => {
        try {
            const response = await fetch(`/cars/${id}`, { method: 'DELETE' });
            if (!response.ok) throw new Error('Failed to delete car');
            fetchCars();
        } catch (error) {
            setError(error.message);
        }
    };

    return (
        <div className="container mt-4">
            <h1 id="tableLabel" className="mb-4">{t('cars')}</h1>
            {error && <div className="alert alert-danger">{error}</div>}
            <div className="mb-4">
                <h2>{isEditing ? t('edit-car') : t('add-car') }</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label htmlFor="make" className="form-label">{t('producer')}</label>
                        <input
                            type="text"
                            id="make"
                            name="make"
                            className="form-control"
                            value={car.make}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="model" className="form-label">{t('model')}</label>
                        <input
                            type="text"
                            id="model"
                            name="model"
                            className="form-control"
                            value={car.model}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="year" className="form-label">{t('year')}</label>
                        <input
                            type="number"
                            id="year"
                            name="year"
                            className="form-control"
                            value={car.year}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="licensePlate" className="form-label">{t('license-plate')}</label>
                        <input
                            type="text"
                            id="licensePlate"
                            name="licensePlate"
                            className="form-control"
                            value={car.licensePlate}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="pricePerDay" className="form-label">{t('price-per-day')}</label>
                        <input
                            type="number"
                            id="pricePerDay"
                            name="pricePerDay"
                            className="form-control"
                            value={car.pricePerDay}
                            onChange={handleChange}
                            required
                            step="0.01"
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="cityId" className="form-label">{t('city')}</label>
                        <select
                            id="cityId"
                            name="cityId"
                            className="form-select"
                            value={car.cityId}
                            onChange={handleChange}
                            required
                        >
                            <option value="">{t('select-city')}</option>
                            {cities.map(city => (
                                <option key={city.id} value={city.id}>
                                    {city.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <button type="submit" className="btn btn-primary">{isEditing ? t('add') : t('save')}</button>
                </form>
            </div>
            {loading ? (
                <p><em>Loading...</em></p>
            ) : (
                <table className="table table-striped table-bordered">
                    <thead className="thead-dark">
                        <tr>
                            <th>{t('producer')}</th>
                            <th>{t('model')}</th>
                            <th>{t('year')}</th>
                            <th>{t('license-plate')}</th>
                            <th>{t('price-per-date')}</th>
                            <th>{t('city')}</th>
                            <th>{t('actions')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {cars.map(car => (
                            <tr key={car.id}>
                                <td>{car.make}</td>
                                <td>{car.model}</td>
                                <td>{car.year}</td>
                                <td>{car.licensePlate}</td>
                                <td>{car.pricePerDay}</td>
                                <td>{car.city ? car.city.name : t('unknown')}</td>
                                <td>
                                    <button className="btn btn-warning btn-sm me-2" onClick={() => editCar(car.id)}>{t('edit')}</button>
                                    <button className="btn btn-danger btn-sm" onClick={() => deleteCar(car.id)}>{t('delete')}</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}
