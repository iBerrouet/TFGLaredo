import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import CustomButton from '@components/CustomButton'
import axios from 'axios'

function ModelDetails() {

    const { modelName } = useParams()
    const [pipeline, setPipeline] = useState('')
    const [metrics, setMetrics] = useState(null)
    const [dataset, setDataset] = useState(null)
    const apiIp = import.meta.env.VITE_API_IP
    const apiPort = import.meta.env.VITE_API_PORT

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
        window.scrollTo(0, 0)
        fetchData()
    }, [])

    const fetchData = async () => {
        try {
            const apiUrl = `http://${apiIp}:${apiPort}/models/${modelName}`

            const response = await axios.get(apiUrl)

            setMetrics(response.data.metrics)
            setDataset(JSON.parse(response.data.dataset))
            setPipeline(response.data.estimator);
        
        } catch (error) {
            console.error('Error fetching data:', error)
        }

    }

    const deployModel = async () => {
        try {
            const apiUrl = `http://${apiIp}:${apiPort}/models/${modelName}/deploy`
            const response = await axios.post(apiUrl)        

        } catch (error) {
            console.error('Error deploying model:', error)
        }
    }

    return(
        <>
            <header className='bg-gray-800 h-20 flex items-center'>
                <>
                    <strong className='text-3xl font-bold italic text-white ml-10 cursor-pointer' onClick={goHome}>LAREDO</strong>
                </>
                <div className='ml-auto mr-10'>  
                    <CustomButton className='mr-10' onClick={goModelCreation}>Create a model</CustomButton>
                    <CustomButton className='' onClick={goModels}>Show available models</CustomButton>
                </div>
            </header>

            <div className='flex flex-col justify-center items-center mt-12'>

            
                <h1 className='text-7xl font-bold text-center mt-12'>Model Details</h1>
                <h2 className='text-5xl font-bold text-center mt-1'>{modelName}</h2>

                <div className='mt-12' dangerouslySetInnerHTML={{ __html: pipeline }} />

                <div className='flex items-center mt-12 w-full'>
                    <div className='flex flex-col items-center w-1/2'>
                        <h2 className='text-white text-3xl font-bold mb-2'>Metrics</h2>
                        <div className=' h-[50vh] overflow-y-auto'>
                            <table className='mt-2 bg-gray-800 text-center'>
                                <thead>
                                    <tr>
                                        <th className='text-white px-9 py-5 border-8 border-slate-950'>Metric</th>
                                        <th className='text-white px-9 py-5 border-8 border-slate-950'>Value</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {metrics && Object.entries(metrics).map(([key, value]) => (
                                        <tr key={key}>
                                            <td className='font-bold px-9 py-5 border-8 border-slate-950'>{key.replace(/_/g, " ")}</td>
                                            <td className='px-9 py-5 border-8 border-slate-950'>{value.toFixed(5)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className='flex flex-col items-center w-1/2'>
                        <h2 className='text-white text-3xl font-bold mb-2'>Dataset</h2>
                        <div class=' h-[50vh] overflow-y-auto'>
                            <table className='mt-2 bg-gray-800 text-center' >
                                <thead>
                                    <tr>
                                        <th className='text-white px-9 py-5 border-8 border-slate-950'>Name</th>
                                        <th className='text-white px-9 py-5 border-8 border-slate-950'>Type</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {dataset && dataset.mlflow_colspec.map((col, index) => (
                                        <tr key={index}>
                                            <td className='font-bold px-9 py-5 border-8 border-slate-950'>{col.name}</td>
                                            <td className='px-9 py-5 border-8 border-slate-950'>{col.type}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                
                <CustomButton className='text-5xl my-20' onClick={deployModel}>Deploy</CustomButton>

            </div>

        </>
    )
}

export default ModelDetails
