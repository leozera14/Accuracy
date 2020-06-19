import React, { useState, useEffect } from 'react';
import { useHistory, Link } from 'react-router-dom';
import { FiPower, FiTrash2, FiDownload } from 'react-icons/fi';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
import moment from 'moment';
import MomentUtils from '@date-io/moment';
import "moment/locale/pt-br";
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css'; 
import './styles.css';


export default function Profile() {
    
    const [inventories, setInventories] = useState([]);

    const [selectedDate, handleDateChange] = useState('');


    const history = useHistory();

    moment.locale("pt-BR");

    const userLogin = localStorage.getItem('userLogin');
    const userName = localStorage.getItem('userName');
    const userStore = localStorage.getItem('userStore');

     useEffect(() => {
        axios.get('inventoryGroup', {
            headers: {
                Authorization: userLogin,
            }
        }).then(response => {
            setInventories(response.data);
        });
    }, [userLogin]);


    async function handleDeleteInventorie(inventory_id) {
        try {
            await axios.delete(`/inventory?id=${inventory_id}`, {
                headers: {
                    Authorizatnaoion: userLogin,
                }
            });
            toast.success(`Inventário ${inventory_id} excluído com sucesso !`);
        } catch (err) {
            toast.error(`Erro ao deletar inventário, tente novamente. ${err}`);
        }
        setInventories(inventories.filter(inventorie => parseInt(inventorie.inventory_id) !== parseInt(inventory_id)));
    }

    function handleLogout() {
        localStorage.clear();
        history.push('/');
    }


    async function download_txt(collector) {
        let { data } = await axios.get(`/inventory?collector=${collector}`);
        let file = '';

        data.map(item => {
            let ean = item.ean.padStart(13, '0');
            let quantidade = new String(item.quantity).padStart(6, '0');
            file += `0000000${ean}${quantidade}\n`;
        });

        let hiddenElement = document.createElement('a');
        hiddenElement.href = 'data:text/txt;charset=utf-8,' + encodeURI(file);
        hiddenElement.target = '_blank';
        hiddenElement.download = `Coletor ${collector}.txt`;
        hiddenElement.click();
    }


    async function dataFilter(date) {
        handleDateChange(date);
        try{
            await axios.get(`/inventory?created_at=${moment(date).format("DD/MM/YYYY")}`).then(response => {
                if(response.data.length > 0) {
                    toast.success('Inventário encontrado.');
                    setInventories(response.data);
                } else {
                    toast.error('Nenhum inventário encontrado.');
                    axios.get(`/inventory`).then(response => {
                        setInventories(response.data);
                    })
                }
            })
        } catch(error) {
            toast.error(`Erro ao filtrar inventários ${error}`);
        }
    }

    return (
        <div className="profile-container">
            <header>
                <a href="">Accuracy</a>
                <span>Bem vindo(a), {userName}</span>

                <span>Loja: {userStore}</span>
                <button type="button" onClick={handleLogout}>
                    <FiPower size={18} color="#E02041" />
                </button>
            </header>

            <h1>Inventários Cadastrados</h1>

            <MuiPickersUtilsProvider libInstance={moment} utils={MomentUtils} locale="pt-BR">
                <KeyboardDatePicker
                    value={selectedDate}
                    placeholder="Escolha uma data"
                    onChange={date => dataFilter(date)}
                    format="DD/MM/yyyy"
                />
            </MuiPickersUtilsProvider>

            <ToastContainer />

            {<div className="inventorie-list">
                    <tbody className="list-title">
                            <tr>
                                <td>Coletor:</td>
                            </tr>
                            
                            <tr>
                                <td>Quantidade de Registros:</td>
                            </tr>
                    </tbody>
                    
                {inventories.map(inventorie => (
                    <div>
                        <div className="separator"></div>
                        <tbody className="list-content" key={inventorie.id}>
                            <tr>      
                                <td>{inventorie.collector}</td>
                            </tr>

                            <tr>             
                                <td>{inventorie.count}</td>
                            </tr>
                            
                            <div className="inventorie-button">
                                <button onClick={() => handleDeleteInventorie(inventorie.id)}
                                type="button" >
                                    <FiTrash2 scale={20} color="#a8a8b3" />
                                </button>

                                <button onClick={() => download_txt(inventorie.collector)}
                                type="button" >
                                    <FiDownload scale={20} color="#a8a8b3" />
                                </button>
                            </div>
                        </tbody>
                     </div>
                ))}
            </div>}
        </div>
    );
}
    