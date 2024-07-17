import React, { useState, useEffect } from 'react';

export function MyRentals() {
    const [rentals, setRentals] = useState([]);

    useEffect(() => {
        async function fetchRentals() {
            try {
                const response = await fetch('/carRental/myRentals', {
                    method: 'GET',
                    credentials: 'include'
                });
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setRentals(data);
            } catch (error) {
                console.error('Failed to fetch rentals:', error);
            }
        }
        fetchRentals();
    }, []);

    return (
        <div>
            <h1>My Rentals</h1>
            <ul>
                {rentals.map(rental => (
                    <li key={rental.id}>
                        {rental.car.make} {rental.car.model} - {rental.car.city.name}, {rental.car.city.country.name}
                        (Rented from {new Date(rental.rentalDate).toLocaleDateString()} to {new Date(rental.returnDate).toLocaleDateString()})
                    </li>
                ))}
            </ul>
        </div>
    );
}
