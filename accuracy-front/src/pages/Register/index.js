import React, { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi'


// import api from '../../services/api';
import axios from 'axios';
import './styles.css';

export default function Register() {
    const [name, setName] = useState('');
    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');
    const [store, setStore] = useState('');

    const history = useHistory();

    async function handleRegister(e) {
        e.preventDefault();

        const data = ({
            name,
            login,
            password,
            store
        });

       try{

        const response = await axios.post('/users', data);

        alert(`${response.data.name} Seu cadastro foi realizado com sucesso !`);

        history.push('/')

       } catch (err) {
        alert(`${err}`);
       }
    }


    return(
        <div className="register-container">
            <div className="content">
                <section> 
                   <h1>Cadastro</h1>

                   <Link className='back-link' to="/">
                        <FiArrowLeft size={16} color="#E02041"/>
                        Tenho cadastro
                    </Link>
                </section>

                <form onSubmit={handleRegister} >
                    <input 
                        placeholder="Nome Completo"
                        value={name}
                        onChange={e => setName(e.target.value)}  
                    />
                    
                    <input
                        placeholder="Email"
                        value={login}
                        onChange={e => setLogin(e.target.value)} 
                    />

                    <input 
                        type="password"
                        placeholder="Senha"
                        value={password}
                        onChange={e => setPassword(e.target.value)} 
                    />

                    <input 
                        type="number"
                        placeholder="Número da loja"
                        value={store}
                        onChange={e => setStore(e.target.value)}  
                    />

                    <button className="button" type="submit">Cadastrar</button>
                </form>
            </div>
        </div>
    );
}