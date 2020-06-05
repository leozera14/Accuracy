import React, { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { FiLogIn } from 'react-icons/fi';

import axios from 'axios';

import './styles.css';

export default function Logon() {
    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');
    const history = useHistory(); 

    async function handleLogin(e) {
        e.preventDefault();

        try {
            const response = await axios.post('sessions', { login, password });

            localStorage.setItem('userLogin', login);
            localStorage.setItem('userName', response.data.name);
            localStorage.setItem('userStore', response.data.store);

            history.push('/profile');

        } catch (err) {
            alert('Falha no login, tente novamente.');
        }
    }

    return (
        <div className="logon-container">
            <section className="form">

                <form onSubmit={handleLogin}>
                    <h1>Faça seu logon</h1>

                    <input 
                    type="email"
                        placeholder="Seu email"   
                        value={login}
                        onChange={e => setLogin(e.target.value)}
                        />

                    <input 
                        type="password"
                        placeholder="Sua senha"   
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        />
                    <button type="submit" className="button">Entrar</button>

                    <Link className='back-link' to="/users">
                        <FiLogIn size={16} color="#E02041"/>
                        Não tenho cadastro
                    </Link>
                </form>
            </section>
        </div>
    )
}