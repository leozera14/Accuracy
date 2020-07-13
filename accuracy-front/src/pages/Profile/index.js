import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { FiPower, FiPlus, FiDownload } from 'react-icons/fi';
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

    const token = localStorage.getItem('token');
    const userName = localStorage.getItem('userName');
    const userStore = localStorage.getItem('userStore');

     useEffect(() => {
        axios.get('inventoryGroup', {
            headers: {
                Authorization: token,
            }
        }).then(response => {
            setInventories(response.data);
        });
    }, [token]);

    async function collectorDetail(collector) {
        try {
            localStorage.setItem('collector', collector);
            toast.success(`Dados do coletor ${collector} sendo carregados.`);
            setTimeout(() =>{
                history.push('/details')
            }, 1500);
        } catch (err) {
            toast.error(`${err}`);
        }
    }

    function handleLogout() {
        localStorage.clear();
        history.push('/');
    }


    async function download_txt(collector) {
        let { data } = await axios.get(`/inventory?collector=${collector}`);
        let file = '';

        data.map(item => {
            let init = new String().padStart(7, '0');
            let ean = item.ean.padStart(13, '0');
            let quantidade = new String(item.quantity).padStart(6, '0');
            file += `${init}${ean}${quantidade}\n`;
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
            await axios.get(`/inventoryGroup?created_at=${moment(date).format("DD/MM/YYYY")}`).then(response => {
                if(response.data.length > 0) {
                    toast.success('Inventário encontrado.');
                    setInventories(response.data);
                } else {
                    toast.error('Nenhum inventário encontrado.');
                    axios.get(`/inventoryGroup`).then(response => {
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
                    helperText={''}
                    format="DD/MM/yyyy"
                    error={null}
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
                                <button onClick={() => collectorDetail(inventorie.collector)}
                                type="button" >
                                    <FiPlus scale={20} color="#a8a8b3" />
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
    