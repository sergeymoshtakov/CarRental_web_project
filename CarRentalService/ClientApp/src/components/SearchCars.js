import React, { useState, useEffect } from 'react';

export function SearchCars() {
    const [countries, setCountries] = useState([]);
    const [cities, setCities] = useState([]);
    const [cars, setCars] = useState([]);
    const [selectedCountry, setSelectedCountry] = useState('');
    const [selectedCity, setSelectedCity] = useState('');
    const [rentalDate, setRentalDate] = useState('');
    const [returnDate, setReturnDate] = useState('');
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

        const rental = new Date(rentalDate);

        const returnD = new Date(returnDate);

        if (rental < today) {
            setMessage({ text: 'Rental date cannot be in the past.', type: 'error' });
            return false;
        }

        if (returnD < rental) {
            setMessage({ text: 'Return date cannot be earlier than rental date.', type: 'error' });
            return false;
        }

        return true;
    };

    return (
        <div>
            <h1>Search Cars</h1>
            <select value={selectedCountry} onChange={handleCountryChange}>
                <option value="">Select Country</option>
                {countries.map(country => <option key={country.id} value={country.id}>{country.name}</option>)}
            </select>
            <br />
            <select value={selectedCity} onChange={handleCityChange} disabled={!selectedCountry}>
                <option value="">Select City</option>
                {cities.map(city => <option key={city.id} value={city.id}>{city.name}</option>)}
            </select>
            <br />
            <button onClick={handleSearch}>Search</button>
            <br />
            <label>
                Rental Date:
                <input type="date" value={rentalDate} onChange={(e) => setRentalDate(e.target.value)} />
            </label>
            <br />
            <label>
                Return Date:
                <input type="date" value={returnDate} onChange={(e) => setReturnDate(e.target.value)} />
            </label>
            <br />
            <ul>
                {cars.map(car => (
                    <li key={car.id}>
                        {car.make} {car.model} - {car.city.name}, {car.city.country.name}
                        <button onClick={() => rentCar(car.id)}>Rent</button>
                    </li>
                ))}
            </ul>
            {message.text && (
                <div style={{ color: message.type === 'success' ? 'green' : 'red' }}>
                    {message.text}
                </div>
            )}
        </div>
    );

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
                body: JSON.stringify({ carId, rentalDate, returnDate }),
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
}
