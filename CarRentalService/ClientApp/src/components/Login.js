import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css'; // Импорт стилей Bootstrap
import { Form, Button, Alert } from 'react-bootstrap';

export function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async () => {
        setError('');
        const user = { email, password };

        const response = await fetch('/account/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(user),
        });

        if (response.ok) {
            navigate('/');
            window.location.reload();
        } else {
            const errorMessage = await response.text();
            setError('Failed to login: Wrong credentials');
        }
    };

    return (
        <div className="container mt-5">
            <h1>Login</h1>
            {error && <Alert variant="danger">{error}</Alert>}
            <Form>
                <Form.Group controlId="formEmail">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                        required
                    />
                </Form.Group>

                <Form.Group controlId="formPassword" className="mt-3">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password"
                        required
                    />
                </Form.Group>

                <Button variant="primary" className="mt-3" onClick={handleLogin}>
                    Login
                </Button>
            </Form>
            <p className="mt-3">
                Don't have an account? <a href="/register">Register</a>
            </p>
        </div>
    );
}
