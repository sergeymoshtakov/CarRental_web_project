import React, { useState, useEffect } from 'react';

export default function SearchCars() {
    const [countries, setCountries] = useState([]);
    const [cities, setCities] = useState([]);
    const [cars, setCars] = useState([]);
    const [selectedCountry, setSelectedCountry] = useState('');
    const [selectedCity, setSelectedCity] = useState('');

    useEffect(() => {
        async function fetchCountries() {
            const response = await fetch('/countries');
            const data = await response.json();
            setCountries(data);
        }
        fetchCountries();
    }, []);

    const handleCountryChange = async (e) => {
        setSelectedCountry(e.target.value);
        const response = await fetch(`/cities?countryId=${e.target.value}`);
        const data = await response.json();
        setCities(data);
    };

    const handleCityChange = (e) => {
        setSelectedCity(e.target.value);
    };

    const handleSearch = async () => {
        const response = await fetch(`/carRental/search?countryId=${selectedCountry}&cityId=${selectedCity}`);
        const data = await response.json();
        setCars(data);
    };

    return (
        <div>
            <h1>Search Cars</h1>
            <select value={selectedCountry} onChange={handleCountryChange}>
                <option value="">Select Country</option>
                {countries.map(country => <option key={country.id} value={country.id}>{country.name}</option>)}
            </select>
            <select value={selectedCity} onChange={handleCityChange} disabled={!selectedCountry}>
                <option value="">Select City</option>
                {cities.map(city => <option key={city.id} value={city.id}>{city.name}</option>)}
            </select>
            <button onClick={handleSearch}>Search</button>
            <ul>
                {cars.map(car => (
                    <li key={car.id}>
                        {car.make} {car.model} - {car.city.name}, {car.city.country.name}
                        <button onClick={() => rentCar(car.id)}>Rent</button>
                    </li>
                ))}
            </ul>
        </div>
    );

    async function rentCar(carId) {
        const rentalDate = new Date().toISOString();
        const returnDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(); // one week later

        const response = await fetch('/carRental/rent', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ carId, rentalDate, returnDate })
        });

        if (response.ok) {
            alert('Car rented successfully');
        } else {
            alert('Failed to rent car');
        }
    }
}
