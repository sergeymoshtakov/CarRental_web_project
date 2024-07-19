import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useTranslation } from 'react-i18next';
import { Form, Button, Alert } from 'react-bootstrap';

export function Login() {
    const { t } = useTranslation();
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
            <h1>{t('login-page')}</h1>
            {error && <Alert variant="danger">{error}</Alert>}
            <Form>
                <Form.Group controlId="formEmail">
                    <Form.Label>{t('email')}</Form.Label>
                    <Form.Control
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder={t('email')}
                        required
                    />
                </Form.Group>

                <Form.Group controlId="formPassword" className="mt-3">
                    <Form.Label>{t('password')}</Form.Label>
                    <Form.Control
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder={t('password')}
                        required
                    />
                </Form.Group>

                <Button variant="primary" className="mt-3" onClick={handleLogin}>
                    {t('login')}
                </Button>
            </Form>
            <p className="mt-3">
                {t('dont-have-an-account')} <a href="/register">{t('register')}</a>
            </p>
        </div>
    );
}
