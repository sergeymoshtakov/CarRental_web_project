import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'; // Импорт стилей Bootstrap

export class Home extends Component {
    static displayName = Home.name;

    render() {
        return (
            <div className="container mt-4">
                <header className="mb-4 text-center">
                    <h1 className="display-4 mb-3">Car Rental Service</h1>
                    <p className="lead">Welcome to our premium car rental service. Explore our wide range of vehicles and enjoy a smooth and hassle-free rental experience.</p>
                </header>

                <div className="row">
                    <div className="col-md-4">
                        <div className="card mb-4 shadow-sm">
                            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/2019_Toyota_Corolla_Icon_Tech_VVT-i_Hybrid_1.8.jpg/2880px-2019_Toyota_Corolla_Icon_Tech_VVT-i_Hybrid_1.8.jpg" className="card-img-top" alt="Luxury Car" />
                            <div className="card-body">
                                <h5 className="card-title">Search a car</h5>
                                <p className="card-text">Search a car in a city where you want to travel</p>
                                <a href="/search-cars" className="btn btn-primary">Explore Cars</a>
                            </div>
                        </div>
                    </div>

                    <div className="col-md-4">
                        <div className="card mb-4 shadow-sm">
                            <img src="https://media-cldnry.s-nbcnews.com/image/upload/t_fit-1240w,f_auto,q_auto:best/newscms/2019_13/2798361/190325-rental-cars-cs-229p.jpg" className="card-img-top" alt="SUV" />
                            <div className="card-body">
                                <h5 className="card-title">My Rentals</h5>
                                <p className="card-text">View and manage your rentals</p>
                                <a href="/my-rentals" className="btn btn-primary">Browse rentals</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
