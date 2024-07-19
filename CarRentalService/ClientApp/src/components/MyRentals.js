import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useTranslation } from 'react-i18next';

export function MyRentals() {
    const { t } = useTranslation();
    const [rentals, setRentals] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [itemsPerPage] = useState(10);

    useEffect(() => {
        async function fetchRentals() {
            try {
                const response = await fetch(`/carRental/myRentals?page=${currentPage}&size=${itemsPerPage}`, {
                    method: 'GET',
                    credentials: 'include'
                });
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setRentals(data.items);
                setTotalPages(data.totalPages);
            } catch (error) {
                console.error('Failed to fetch rentals:', error);
            }
        }
        fetchRentals();
    }, [currentPage, itemsPerPage]);

    const calculateRentalPrice = (rentalDate, returnDate, pricePerDay, paymentMethod) => {
        const startDate = new Date(rentalDate);
        const endDate = new Date(returnDate);
        const timeDiff = endDate - startDate;

        if (paymentMethod === 'perHour') {
            const hoursRented = Math.ceil(timeDiff / (1000 * 3600));
            return (pricePerDay / 24) * hoursRented;
        } else if (paymentMethod === 'perMinute') {
            const minutesRented = Math.ceil(timeDiff / (1000 * 60));
            return (pricePerDay / (24 * 60)) * minutesRented;
        } else {
            const daysRented = Math.ceil(timeDiff / (1000 * 3600 * 24)) || 1;
            return daysRented * pricePerDay;
        }
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

    const handlePageChange = (newPage) => {
        if (newPage > 0 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };

    return (
        <div className="container mt-4">
            <h1 className="mb-4">{t('myRentals')}</h1>

            <table className="table table-striped table-bordered">
                <thead className="thead-dark">
                    <tr>
                        <th>#</th>
                        <th>{t('car')}</th>
                        <th>{t('location')}</th>
                        <th>{t('rental-date')}</th>
                        <th>{t('return-date')}</th>
                        <th>{t('price')}</th>
                        <th>{t('actions')}</th>
                    </tr>
                </thead>
                <tbody>
                    {rentals.map((rental, index) => (
                        <tr key={rental.id}>
                            <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                            <td>{rental.car.make} {rental.car.model}</td>
                            <td>{rental.car.city.name}, {rental.car.city.country.name}</td>
                            <td>{new Date(rental.rentalDate).toLocaleDateString()}</td>
                            <td>{new Date(rental.returnDate).toLocaleDateString()}</td>
                            <td>${calculateRentalPrice(rental.rentalDate, rental.returnDate, rental.car.pricePerDay, rental.paymentMethod).toFixed(2)}</td>
                            <td>
                                <button className="btn btn-danger" onClick={() => handleCancel(rental.id)}>{t('cancel')}</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div className="d-flex justify-content-between">
                <button className="btn btn-primary" onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
                    {t('previous')}
                </button>
                <span>{t('page')} {currentPage} {t('of')} {totalPages}</span>
                <button className="btn btn-primary" onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
                    {t('next')}
                </button>
            </div>
        </div>
    );
}
