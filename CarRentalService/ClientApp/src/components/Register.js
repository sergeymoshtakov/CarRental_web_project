import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css'; // Импорт стилей Bootstrap
import { Form, Button, Alert } from 'react-bootstrap';

export function Register() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [phone, setPhone] = useState('');
    const [role, setRole] = useState('user'); // Устанавливаем роль по умолчанию
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const validateEmail = (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(String(email).toLowerCase());
    };

    const handleRegister = async () => {
        setError('');

        // Валидация
        if (!name) {
            setError('Name is required');
            return;
        }
        if (!email) {
            setError('Email is required');
            return;
        }
        if (!validateEmail(email)) {
            setError('Invalid email format');
            return;
        }
        if (!password) {
            setError('Password is required');
            return;
        }
        if (password.length < 6) {
            setError('Password must be at least 6 characters long');
            return;
        }
        if (!phone) {
            setError('Phone number is required');
            return;
        }

        const user = { name, email, password, phone, role };

        try {
            const response = await fetch('/account/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(user),
            });

            if (response.ok) {
                navigate('/login');
            } else {
                const errorMessage = await response.text();
                setError(`Failed to register: ${errorMessage}`);
            }
        } catch (error) {
            setError(`Failed to register: ${error.message}`);
        }
    };

    return (
        <div className="container mt-5">
            <h1>Register</h1>
            {error && <Alert variant="danger">{error}</Alert>}
            <Form>
                <Form.Group controlId="formName">
                    <Form.Label>Name</Form.Label>
                    <Form.Control
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Enter your name"
                        required
                    />
                </Form.Group>

                <Form.Group controlId="formEmail" className="mt-3">
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

                <Form.Group controlId="formPhone" className="mt-3">
                    <Form.Label>Phone</Form.Label>
                    <Form.Control
                        type="text"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="Enter your phone number"
                        required
                    />
                </Form.Group>

                <Button variant="primary" className="mt-3" onClick={handleRegister}>
                    Register
                </Button>
            </Form>
            <p className="mt-3">
                Already have an account? <a href="/login">Log in</a>
            </p>
        </div>
    );
}
