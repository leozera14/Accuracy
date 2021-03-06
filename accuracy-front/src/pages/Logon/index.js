import React, { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { FiLogIn } from 'react-icons/fi';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css'; 
import axios from 'axios';
import './styles.css';

export default function Logon() {
    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');
    const history = useHistory(); 

    async function handleLogin(e) {
        e.preventDefault();

        try {
            await axios.post('/users/login', { login, password })
                .then(function(response){ 
                    if(response.status === 200) {
                        localStorage.setItem('token', response.data.token);
                        localStorage.setItem('userName', response.data.name);
                        localStorage.setItem('userStore', response.data.store);
                        toast.success("Usuario encontrado, redirecionando...");
                        setTimeout(() =>{
                            history.push('/profile');   
                        }, 1750);
                    }
                })
        } catch (err) {
            toast.error('Usuário ou senha incorretos, tente novamente.');
        }
    }

    return (
        <div className="logon-container">
            <section className="form">

                <form onSubmit={handleLogin}>
                    <h1>Faça seu login</h1>

                    <input 
                        placeholder="Seu usuário"   
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

                    <ToastContainer />
                </form>
            </section>
        </div>
    )
}