import React, { useState } from 'react';
import { useHistory, Link } from 'react-router-dom';
import { FiPower, FiTrash2 } from 'react-icons/fi';
import axios from 'axios';
import { useFetch } from '../../hooks/useFetch';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css'; 
import './styles.css';


export default function Details() {
    
    const [inventories, setInventories] = useState([]);

    const history = useHistory();

    const token = localStorage.getItem('token');
    const userName = localStorage.getItem('userName');
    const userStore = localStorage.getItem('userStore');
    const collector = localStorage.getItem('collector');

    const { data } = useFetch(`/inventory?collector=${collector}`);

    if(!data) {
        return <p>Carregando...</p>
    }

    async function handleDeleteInventorie(inventory_id) {
        try {
            await axios.delete(`/inventory?id=${inventory_id}`, {
                headers: {
                    Authorization: token,
                }
            });
            toast.success(`Inventário ${inventory_id} excluído com sucesso !`);
        } catch (err) {
            toast.error(`Erro ao deletar inventário, tente novamente. ${err}`);
        }
        setInventories(data.filter(inventorie => parseInt(inventorie.inventory_id) !== parseInt(inventory_id)));
    }

    function handleLogout() {
        localStorage.clear();
        history.push('/');
    }

    return (
        <div className="container">
            <header>
                <Link to={"/profile"}>Accuracy</Link>

                <span>Dados do coletor: {collector}</span>

                <span>Bem vindo(a), {userName}</span>

                <span>Loja: {userStore}</span>
                <button type="button" onClick={handleLogout}>
                    <FiPower size={18} color="#E02041" />
                </button>
            </header>

            <h1>Inventários Cadastrados</h1>

            <ToastContainer />

            {<div className="inventorie">
                    <tbody className="title">
                            <tr>
                                <td>N° Inventário:</td>
                            </tr>
                            
                            <tr>
                                <td>EAN:</td>
                            </tr>

                            <tr>
                                <td>Quantidade:</td>
                            </tr>
                    </tbody>
                    
                {data.map(inventorie => (
                    <div>
                        <div className="separator"></div>
                        <tbody className="content-list" key={inventorie.id}>
                            <tr>      
                                <td>{inventorie.inventory_number}</td>
                            </tr>

                            <tr>             
                                <td>{inventorie.ean}</td>
                            </tr>

                            <tr>             
                                <td>{inventorie.quantity}</td>
                            </tr>
                            
                            <div className="inventorie-button">
                                <button onClick={() => handleDeleteInventorie(inventorie.id)}
                                type="button" >
                                    <FiTrash2 scale={20} color="#a8a8b3" />
                                </button>
                            </div>
                        </tbody>
                     </div>
                ))}
            </div>}
        </div>
    );
}
    