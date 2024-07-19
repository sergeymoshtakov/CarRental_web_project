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

    const calculateRentalPrice = (rentalDate, returnDate, pricePerDay) => {
        const startDate = new Date(rentalDate);
        const endDate = new Date(returnDate);
        const timeDiff = endDate - startDate;
        const daysRented = Math.ceil(timeDiff / (1000 * 3600 * 24)) || 1;
        return daysRented * pricePerDay;
    };

    const handleCancel = async (rentalId) => {
        try {
            const response = await fetch(`/carRental/cancel/${rentalId}`, {
                method: 'DELETE',
                credentials: 'include'
            });
            if (!response.ok) {
                throw new Error('Failed to cancel rental');
            }
            const updatedRentals = rentals.filter(rental => rental.id !== rentalId);
            setRentals(updatedRentals);
        } catch (error) {
            console.error('Failed to cancel rental:', error);
        }
    };

    return (
        <div>
            <h1>My Rentals</h1>
            <table className="table table-striped" aria-labelledby="tableLabel">
                <thead>
                    <tr>
                        <th>Car</th>
                        <th>Location</th>
                        <th>Rental Date</th>
                        <th>Return Date</th>
                        <th>Price</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {rentals.map(rental => (
                        <tr key={rental.id}>
                            <td>{rental.car.make} {rental.car.model}</td>
                            <td>{rental.car.city.name}, {rental.car.city.country.name}</td>
                            <td>{new Date(rental.rentalDate).toLocaleDateString()}</td>
                            <td>{new Date(rental.returnDate).toLocaleDateString()}</td>
                            <td>${calculateRentalPrice(rental.rentalDate, rental.returnDate, rental.car.pricePerDay).toFixed(2)}</td>
                            <td>
                                <button onClick={() => handleCancel(rental.id)}>Cancel</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
