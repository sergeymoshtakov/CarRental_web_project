import React, { Component } from 'react';
import { useTranslation } from 'react-i18next';
import 'bootstrap/dist/css/bootstrap.min.css'; 

export function Home() {
    const { t } = useTranslation();

    return (
        <div className="container mt-4">
            <header className="mb-4 text-center">
                <h1 className="display-4 mb-3">Car Rental Service</h1>
                <p className="lead">{t('welcome')}</p>
            </header>

            <div className="row">
                <div className="col-md-4">
                    <div className="card mb-4 shadow-sm">
                        <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/2019_Toyota_Corolla_Icon_Tech_VVT-i_Hybrid_1.8.jpg/2880px-2019_Toyota_Corolla_Icon_Tech_VVT-i_Hybrid_1.8.jpg" className="card-img-top" alt="search a car" />
                        <div className="card-body">
                            <h5 className="card-title">{t('searchCar')}</h5>
                            <p className="card-text">{t('searchCarDescription')}</p>
                            <a href="/search-cars" className="btn btn-primary">{t('searchCar')}</a>
                        </div>
                    </div>
                </div>

                <div className="col-md-4">
                    <div className="card mb-4 shadow-sm">
                        <img src="https://media-cldnry.s-nbcnews.com/image/upload/t_fit-1240w,f_auto,q_auto:best/newscms/2019_13/2798361/190325-rental-cars-cs-229p.jpg" className="card-img-top" alt="my rentals" />
                        <div className="card-body">
                            <h5 className="card-title">{t('myRentals')}</h5>
                            <p className="card-text">{t('myRentalsDescription')}</p>
                            <a href="/my-rentals" className="btn btn-primary">{t('browseRentals')}</a>
                        </div>
                    </div>
                </div>

                <div className="col-md-4">
                    <div className="card mb-4 shadow-sm">
                        <img src="https://d99ngkg9mjpdb.cloudfront.net/assets/20181210/images/auto/automotive-statistics-01.jpg" className="card-img-top" alt="statistics" />
                        <div className="card-body">
                            <h5 className="card-title">{t('my-statistics')}</h5>
                            <p className="card-text">{t('my-statistics-description')}</p>
                            <a href="/user-statistics" className="btn btn-primary">{t('browse-statistics')}</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}