import React, { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi'
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css'; 
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
        await axios.post('/users/register', data)
            .then(function(response){
                if(response.status === 200){
                    toast.success(`${response.data.name} Seu cadastro foi realizado com sucesso !`);
                    setTimeout(() =>{
                        history.push('/')
                    }, 3250);
                }
            });
       } catch (err) {
        if(err.response.status === 400) {
            toast.error(err.response.data.error);
        }
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
                        placeholder="Usuário"
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
                <ToastContainer />
            </div>
        </div>
    );
}