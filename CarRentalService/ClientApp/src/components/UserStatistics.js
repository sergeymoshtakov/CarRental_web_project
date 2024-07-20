import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { useTranslation } from 'react-i18next';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export function UserStatistics() {
    const { t } = useTranslation();
    const [statistics, setStatistics] = useState(null);

    useEffect(() => {
        const fetchStatistics = async () => {
            try {
                const response = await fetch('/carRental/userStatistics');
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setStatistics(data);
            } catch (error) {
                console.error('Error fetching statistics:', error);
            }
        };

        fetchStatistics();
    }, []);

    if (!statistics) {
        return <div>Loading...</div>;
    }

    const createChartData = (labels, data, label, backgroundColor, borderColor) => ({
        labels: labels,
        datasets: [
            {
                label: label,
                data: data,
                backgroundColor: backgroundColor,
                borderColor: borderColor,
                borderWidth: 1,
            },
        ],
    });

    const rentalsByCityData = createChartData(
        Object.keys(statistics.rentalsByCity),
        Object.values(statistics.rentalsByCity),
        t('rentalsByCity'),
        'rgba(75, 192, 192, 0.2)',
        'rgba(75, 192, 192, 1)'
    );

    const rentalsByCarData = createChartData(
        Object.keys(statistics.rentalsByCar),
        Object.values(statistics.rentalsByCar),
        t('rentalsByCar'),
        'rgba(153, 102, 255, 0.2)',
        'rgba(153, 102, 255, 1)'
    );

    const moneyByCityData = createChartData(
        Object.keys(statistics.moneyByCity),
        Object.values(statistics.moneyByCity),
        t('moneyByCity'),
        'rgba(255, 159, 64, 0.2)',
        'rgba(255, 159, 64, 1)'
    );

    const moneyByCarData = createChartData(
        Object.keys(statistics.moneyByCar),
        Object.values(statistics.moneyByCar),
        t('moneyByCar'),
        'rgba(54, 162, 235, 0.2)',
        'rgba(54, 162, 235, 1)'
    );

    const timeByCityData = createChartData(
        Object.keys(statistics.timeByCity),
        Object.values(statistics.timeByCity),
        t('timeByCity'),
        'rgba(255, 99, 132, 0.2)',
        'rgba(255, 99, 132, 1)'
    );

    const timeByCarData = createChartData(
        Object.keys(statistics.timeByCar),
        Object.values(statistics.timeByCar),
        t('timeByCar'),
        'rgba(75, 192, 192, 0.2)',
        'rgba(75, 192, 192, 1)'
    );

    return (
        <div>
            <h1>{t('userStatistics')}</h1>
            <div>
                <p>{t('totalSpent')} { statistics.totalSpent.toFixed(2) }</p>
                <p>{t('uniqueCarsRented')} { statistics.uniqueCarsRented }</p>
                <p>{t('totalDaysRented')} { statistics.totalDaysRented }</p>
                <p>{t('totalHoursRented')} { statistics.totalHoursRented.toFixed(2) }</p>
            </div>
            <h2>{t('rentalsByCity')}</h2>
            <Bar data={rentalsByCityData} />
            <h2>{t('rentalsByCar')}</h2>
            <Bar data={rentalsByCarData} />
            <h2>{t('moneyByCity')}</h2>
            <Bar data={moneyByCityData} />
            <h2>{t('moneyByCar')}</h2>
            <Bar data={moneyByCarData} />
            <h2>{t('timeByCity')}</h2>
            <Bar data={timeByCityData} />
            <h2>{t('timeByCar')}</h2>
            <Bar data={timeByCarData} />
        </div>
    );
}
