import React, { useState } from 'react';
import ReactDOM from 'react-dom'
import { useHistory } from 'react-router-dom';
import { FiPower, FiPlus, FiDownload, FiRefreshCcw } from 'react-icons/fi';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
import moment from 'moment';
import MomentUtils from '@date-io/moment';
import "moment/locale/pt-br";
import axios from 'axios';
import { useFetch } from '../../hooks/useFetch';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css'; 
import './styles.css';


export default function Profile() {

    const [inventories, setInventories] = useState([]);

    const filterInventories = Object.values(inventories);

    const [selectedDate, handleDateChange] = useState('');

    const history = useHistory();  

    const { data } = useFetch('inventoryGroup');
    
    if(!data) {
        return <p>Carregando...</p>
    }  

    moment.locale("pt-BR");
    
    const userName = localStorage.getItem('userName');
    const userStore = localStorage.getItem('userStore');

    async function collectorDetail(collector) {
        try {
            localStorage.setItem('collector', collector);
            history.push(`/details/${collector}`)
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
        date = moment(date).format("DD/MM/YYYY");
        try{   
            await axios.get(`/inventoryGroup?created_at=${date}`).then(response => {
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
                <h1>Accuracy</h1>
                <span>Bem vindo(a), {userName}</span>

                <span>Loja: {userStore}</span>
                <button type="button" onClick={handleLogout}>
                    <FiPower size={18} color="#E02041" />
                </button>
            </header>

            <h1 className="registered-h1">Inventários Cadastrados</h1>

            <div className="date-container">
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

                <div className="refresh">
                    <a href="/profile" ><FiRefreshCcw size={18} color="#E02041" /></a>
                </div>
            </div>
            <ToastContainer />

            <div className="inventorie-list">
                    <tbody className="list-title">
                            <tr>
                                <td>Coletor:</td>
                            </tr>
                            
                            <tr>
                                <td>Quantidade de Registros:</td>
                            </tr>
                    </tbody>
                
                {inventories.length <= 0          
                    ?  data.map(inventorie => (
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
                    ))  
                    : filterInventories.map(inventorie => (
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
                                        <FiDownload scale={20} color="#a8a8b3"/>
                                    </button>
                                </div>
                            </tbody>
                        </div>
                    ))
                }
            </div>
        </div>
    );
}
    