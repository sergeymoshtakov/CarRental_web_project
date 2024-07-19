import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'; // Импорт стилей Bootstrap

export function SearchCars() {
    const [countries, setCountries] = useState([]);
    const [cities, setCities] = useState([]);
    const [cars, setCars] = useState([]);
    const [selectedCountry, setSelectedCountry] = useState('');
    const [selectedCity, setSelectedCity] = useState('');
    const [rentalDate, setRentalDate] = useState('');
    const [rentalTime, setRentalTime] = useState('');
    const [returnDate, setReturnDate] = useState('');
    const [returnTime, setReturnTime] = useState('');
    const [rentalType, setRentalType] = useState('Daily');
    const [message, setMessage] = useState({ text: '', type: '' });

    useEffect(() => {
        async function fetchCountries() {
            try {
                const response = await fetch('countries');
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setCountries(data);
            } catch (error) {
                console.error('Failed to fetch countries:', error);
            }
        }
        fetchCountries();
    }, []);

    const handleCountryChange = async (e) => {
        setSelectedCountry(e.target.value);
        try {
            const response = await fetch(`cities?countryId=${e.target.value}`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setCities(data);
        } catch (error) {
            console.error('Failed to fetch cities:', error);
        }
    };

    const handleCityChange = (e) => {
        setSelectedCity(e.target.value);
    };

    const handleSearch = async () => {
        try {
            const response = await fetch(`carRental/search?countryId=${selectedCountry}&cityId=${selectedCity}`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setCars(data);
        } catch (error) {
            console.error('Failed to fetch cars:', error);
        }
    };

    const validateDates = () => {
        const today = new Date();
        const rentalDateTime = new Date(`${rentalDate}T${rentalTime}`);
        const returnDateTime = new Date(`${returnDate}T${returnTime}`);

        if (rentalDateTime < today) {
            setMessage({ text: 'Rental date cannot be in the past.', type: 'error' });
            return false;
        }

        if (returnDateTime <= rentalDateTime) {
            setMessage({ text: 'Return date must be after the rental date.', type: 'error' });
            return false;
        }

        return true;
    };

    async function rentCar(carId) {
        if (!validateDates()) {
            return;
        }

        try {
            const response = await fetch('/carRental/rent', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    carId,
                    rentalDate: `${rentalDate}T${rentalTime}`,
                    returnDate: `${returnDate}T${returnTime}`,
                    rentalType
                }),
            });

            if (!response.ok) {
                throw new Error(`Network response was not ok: ${await response.text()}`);
            }

            const data = await response.json();
            setMessage({ text: 'Car rented successfully!', type: 'success' });
        } catch (error) {
            setMessage({ text: `Failed to rent car: ${error.message}`, type: 'error' });
        }
    }

    return (
        <div className="container mt-4">
            <h1 className="mb-4">Search Cars</h1>

            <div className="row mb-4">
                <div className="col-md-4">
                    <div className="form-group">
                        <label htmlFor="countrySelect">Country</label>
                        <select
                            id="countrySelect"
                            className="form-control"
                            value={selectedCountry}
                            onChange={handleCountryChange}
                        >
                            <option value="">Select Country</option>
                            {countries.map(country => (
                                <option key={country.id} value={country.id}>{country.name}</option>
                            ))}
                        </select>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="form-group">
                        <label htmlFor="citySelect">City</label>
                        <select
                            id="citySelect"
                            className="form-control"
                            value={selectedCity}
                            onChange={handleCityChange}
                            disabled={!selectedCountry}
                        >
                            <option value="">Select City</option>
                            {cities.map(city => (
                                <option key={city.id} value={city.id}>{city.name}</option>
                            ))}
                        </select>
                    </div>
                </div>
                <div className="col-md-4 d-flex align-items-end">
                    <button className="btn btn-primary" onClick={handleSearch}>Search</button>
                </div>
            </div>

            <div className="row mb-4">
                <div className="col-md-3">
                    <div className="form-group">
                        <label htmlFor="rentalDate">Rental Date</label>
                        <input
                            id="rentalDate"
                            type="date"
                            className="form-control"
                            value={rentalDate}
                            onChange={(e) => setRentalDate(e.target.value)}
                        />
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="form-group">
                        <label htmlFor="rentalTime">Rental Time</label>
                        <input
                            id="rentalTime"
                            type="time"
                            className="form-control"
                            value={rentalTime}
                            onChange={(e) => setRentalTime(e.target.value)}
                        />
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="form-group">
                        <label htmlFor="returnDate">Return Date</label>
                        <input
                            id="returnDate"
                            type="date"
                            className="form-control"
                            value={returnDate}
                            onChange={(e) => setReturnDate(e.target.value)}
                        />
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="form-group">
                        <label htmlFor="returnTime">Return Time</label>
                        <input
                            id="returnTime"
                            type="time"
                            className="form-control"
                            value={returnTime}
                            onChange={(e) => setReturnTime(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            <div className="mb-4">
                <div className="form-group">
                    <label htmlFor="rentalType">Rental Type</label>
                    <select
                        id="rentalType"
                        className="form-control"
                        value={rentalType}
                        onChange={(e) => setRentalType(e.target.value)}
                    >
                        <option value="Daily">Daily</option>
                        <option value="Hourly">Hourly</option>
                        <option value="ByMinute">By Minute</option>
                    </select>
                </div>
            </div>

            {message.text && (
                <div className={`alert ${message.type === 'success' ? 'alert-success' : 'alert-danger'}`} role="alert">
                    {message.text}
                </div>
            )}

            <div className="row">
                {cars.map(car => (
                    <div key={car.id} className="col-md-4 mb-4">
                        <div className="card">
                            <div className="card-body">
                                <h5 className="card-title">{car.make} {car.model}</h5>
                                <p className="card-text">
                                    <strong>Location:</strong> {car.city.name}, {car.city.country.name}
                                </p>
                                <button className="btn btn-primary" onClick={() => rentCar(car.id)}>Rent</button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
