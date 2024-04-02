import React, { useState, useEffect } from 'react'
import axios from 'axios'
import eyeIcon from '../assets/eyeIcon.png'
import CustomButton from './CustomButton'
import { useNavigate } from 'react-router-dom'


function Models() {

    const [models, setModels] = useState([])
    const navigate = useNavigate()


    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = async () => {
        try {
            const response = await axios.get('http://localhost:5050/models');
            const formattedData = response.data.map(model => ({
                ...model,
                creation_date: new Date(model.creation_time).toLocaleDateString()
            }))
        
            setModels(formattedData);
        } catch (error) {
            console.error('Error fetching data:', error)
        }
    };
    
    const goHome = () => {
        navigate('/')
    };

    const goDetails = (modelName) => {
        navigate(`/models/${modelName}`)
    };


    return (
        <>
            <header className='bg-gray-800 h-20 flex items-center'>
                <strong className='text-3xl font-bold italic text-white ml-10 cursor-pointer' onClick={goHome}>LAREDO</strong>
                <CustomButton className='ml-auto mr-10'>Crear un modelo</CustomButton>
            </header>
            
            <h1 className='text-7xl font-bold text-center mt-24'>Modelos Disponibles</h1>

            <p className='text-lg text-center mt-14'>Actualmente, el repositorio tiene estos modelos disponibles. Si desea obtener más información pulse en el icono.</p>

            <table className='mx-auto mt-7'>
                <thead>
                    <tr>
                        <th className='text-white px-24'>Modelo</th>
                        <th className='text-white'>Fecha de creación</th>
                        <th className='text-white'>Etapa de desarrollo</th>
                        <th className='text-white'></th>
                    </tr>
                </thead>
                <tbody>
                    {models.map((model) => (
                        <tr key={model.model_name}>
                            <td className='font-bold'>{model.model_name}</td>
                            <td>{model.creation_date}</td>
                            <td>{model.development_stage}</td>
                            <td>
                                <div className='flex flex-col items-center group relative'>
                                    <p className='hidden absolute text-white text-xs whitespace-nowrap -top-5 group-hover:block'>
                                        Mostrar detalles
                                    </p>
                                    <img src={eyeIcon} className='w-6 h-5 cursor-pointer' alt='An eye to link to details' onClick={() => goDetails(model.model_name)} />
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </>
    );

}

export default Models
