import React, { useState, useEffect, Text } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { FiPower, FiTrash2, FiDownload } from 'react-icons/fi';

import axios from 'axios';
import './styles.css';

export default function Profile () {
    const [inventories, setInventories] = useState([]);

    const history = useHistory();

    const userLogin = localStorage.getItem('userLogin');
    const userName = localStorage.getItem('userName');
    const userStore = localStorage.getItem('userStore');

    const data = [
        ['Foo', 'programmer'],
        ['Bar', 'bus driver'],
        ['Moo', 'Reindeer Hunter']
     ];

     useEffect(() => {
        axios.get('profile', {
            headers: {
                Authorization: userLogin,
            }
        }).then(response => {
            setInventories(response.data);
        })
    }, [userLogin]);

    async function handleDeleteInventorie(id) {
        try {
            await axios.delete(`inventory/${id}`, {
                headers: {
                    Authorization: userLogin,
                }
            });

            setInventories(inventories.filter(inventorie => inventorie.id !== id));

        } catch (err) {
            alert('Erro ao deletar inventário, tente novamente.');
        }
    }

    function handleLogout() {
        localStorage.clear();

        history.push('/');
    }

    function download_txt(  ) {
        var txt = 'Name,Title\n';
        data.forEach(function(row) {
                txt += row.join(',');
                txt += "\n";
        });

        console.log(txt);
        var hiddenElement = document.createElement('a');
        hiddenElement.href = 'data:text/txt;charset=utf-8,' + encodeURI(txt);
        hiddenElement.target = '_blank';
        hiddenElement.download = 'people.txt';
        hiddenElement.click();
    }

    return (
        <div className="profile-container">
            <header>
                <span>Bem vindo(a), {userName}</span>

                <span>Loja: {userStore}</span>
                <button type="button" onClick={handleLogout}>
                    <FiPower size={18} color="#E02041" />
                </button>
            </header>

            <h1>Inventários Cadastrados</h1>

            {<ul>
                {inventories.map(inventorie => (
                    <li key={inventorie.id}>
                         <b>ID:</b>
                         <p>{inventorie.id}</p>

                         <b>Usuário:</b>
                         <p>{inventorie.user}</p>
     
                         <b>Area:</b>
                         <p>{inventorie.area}</p>

                         <b>Subarea:</b>
                         <p>{inventorie.subarea}</p>

                         <b>Quantidade Packing:</b>
                         <p>{inventorie.quantity_packing}</p>

                         <b>Seq Produto:</b>
                         <p>{inventorie.seqproduto}</p>
     
                         
                         <div>
                            <button onClick={() => handleDeleteInventorie(inventorie.id)}
                            type="button" >
                                <FiTrash2 scale={20} color="#a8a8b3" />
                            </button>

                            <button onClick={() => download_txt(inventorie.id)}
                            type="button" >
                                <FiDownload scale={20} color="#a8a8b3" />
                            </button>
                         </div>
                     </li>
                ))}
            </ul>}
        </div>
    );
}
    