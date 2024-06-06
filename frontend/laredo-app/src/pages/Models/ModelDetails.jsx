import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import CustomButton from '@components/CustomButton'
import axios from 'axios'

function ModelDetails() {

    const { modelName } = useParams()
    const [htmlContent, setHtmlContent] = useState('');
    const [metrics, setMetrics] = useState(null)
    const [dataset, setDataset] = useState(null)

    const navigate = useNavigate()

    const goHome = () => {
        navigate('/')
    }

    const goModels = () => {
        navigate('/models')
    }

    const goModelCreation = () => {
        navigate('/model-creation')
    }

    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = async () => {
        try {
            const response = await axios.get(`http://localhost:5050/models/${modelName}`)

            setMetrics(response.data.metrics)
            setDataset(JSON.parse(response.data.dataset))
            setHtmlContent(response.data.html_content);
        
        } catch (error) {
            console.error('Error fetching data:', error)
        }

    }


    return(
        <>
            <header className='bg-gray-800 h-20 flex items-center'>
                <>
                    <strong className='text-3xl font-bold italic text-white ml-10 cursor-pointer' onClick={goHome}>LAREDO</strong>
                </>
                <div className='ml-auto mr-10'>  
                    <CustomButton className='mr-10' onClick={goModels}>Show available models</CustomButton>
                    <CustomButton className='' onClick={goModelCreation}>Create a model</CustomButton>
                </div>
            </header>

            <h1 className='text-7xl font-bold text-center mt-12'>Model Details</h1>
            <h2 className='text-5xl font-bold text-center mt-1'>{modelName}</h2>

            <div className='flex justify-center items-center mt-12'>
                <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
            </div>

            <div className='flex justify-between mt-12'>
                <div className='flex flex-col items-center w-1/2'>
                    <h2 className='text-white text-3xl font-bold mb-2'>Metrics</h2>
                    <table className='mt-2 bg-gray-800 text-center'>
                        <thead>
                            <tr>
                                <th className='text-white px-9 py-5 border-8 border-slate-950'>Metric</th>
                                <th className='text-white px-9 py-5 border-8 border-slate-950'>Value</th>
                            </tr>
                        </thead>
                        <tbody>
                            {metrics && Object.entries(metrics).map(([key, value], index) => (
                                <tr key={key}>
                                    <td className='font-bold px-9 py-5 border-8 border-slate-950'>{key.replace(/_/g, " ")}</td>
                                    <td className='px-9 py-5 border-8 border-slate-950'>{value.toFixed(5)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className='flex flex-col items-center w-1/2'>
                    <h2 className='text-white text-3xl font-bold mb-2'>Dataset</h2>
                    <table className='mt-2 bg-gray-800 text-center'>
                        <thead>
                            <tr>
                                <th className='text-white px-9 py-5 border-8 border-slate-950'>Name</th>
                                <th className='text-white px-9 py-5 border-8 border-slate-950'>Type</th>
                                <th className='text-white px-9 py-5 border-8 border-slate-950'>Required</th>
                            </tr>
                        </thead>
                        <tbody>
                            {dataset && dataset.mlflow_colspec.map((col, index) => (
                                <tr key={index}>
                                    <td className='font-bold px-9 py-5 border-8 border-slate-950'>{col.name}</td>
                                    <td className='px-9 py-5 border-8 border-slate-950'>{col.type}</td>
                                    <td className='px-9 py-5 border-8 border-slate-950'>{col.required.toString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                </div>
            </div>
        </>
    );
}

export default ModelDetails
