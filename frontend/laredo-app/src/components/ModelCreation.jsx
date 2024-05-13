import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import CustomButton from './CustomButton'
import DatasetPreprocessing from './DatasetPreprocessing'
import DatasetUploading from './DatasetUploading'
import ModelSelection from './ModelSelection'
import ModelEvaluation from './ModelEvaluation'
import Papa from 'papaparse'
import axios from 'axios'
import algorithmData from '../assets/algorithmParameters.json'


const Steps = {
    Dataset: 'Dataset',
    Preprocessing: 'Preprocessing',
    Algorithm: 'Algorithm',
    Evaluation: 'Evaluation'
}


function ModelCreation() {
    const [activeButton, setActiveButton] = useState('')
    const [datasetFile, setDatasetFile] = useState(null)
    const [columnsDataType, setColumnsDataType] = useState({})
    const [preview, setPreview] = useState([])
    const [datasetUploaded, setDatasetUploaded] = useState(false)
    const [columns, setColumns] = useState([])
    const [hasHeader, setHasHeader] = useState(true)

    const [algorithm, setAlgorithm] = useState("")
    const [parametersValue, setParametersValue] = useState({})

    const [modelName, setModelName] = useState("")
    const [modelNameError, setModelNameError] = useState("")
    const [problemType, setProblemType] = useState("")
    const [problemTypeError, setProblemTypeError] = useState("")
    const [hasStarted, setHasStarted] = useState(false)
    const [problemTypes, setProblemTypes] = useState([])

    const [metrics, setMetrics] = useState({})


    const navigate = useNavigate()

    const activeButtonStyle = 'bg-transparent text-cyan-400 font-bold text-lg py-2 w-40'
    const inactiveButtonStyle = 'bg-gray-900 hover:bg-transparent hover:text-cyan-400 text-white text-lg  py-2 w-40'

    useEffect(() => {
        const uniqueProblemTypes = Array.from(new Set(Object.keys(algorithmData)))
        setProblemTypes(uniqueProblemTypes)
    }, [])

    const goHome = () => {
        navigate('/')
    }

    const goModels = () => {
        navigate('/models')
    }

    const handleHasStarted = () => {
        setModelNameError('')
        setProblemTypeError('')
        if (!modelName) {
            setModelNameError('Please enter a model name')
        }  
        if (!problemType) {
            setProblemTypeError('Please select a problem type')
        }
        if (modelName && problemType) {
            setHasStarted(true)
            setActiveButton(Steps.Dataset)
        }
    }

    const handleActive = (step) => {
        setActiveButton(step)
    }

    const handleNextStep = async () => {
        switch (activeButton) {
            case Steps.Dataset:
                setActiveButton(Steps.Preprocessing);
                break;
            case Steps.Preprocessing:
                setActiveButton(Steps.Algorithm);
                break;
            case Steps.Algorithm:
                setActiveButton(Steps.Evaluation);
                try {
                    setMetrics(await callAPI())
                } catch (error) {
                    console.error('Incorrect API call:', error)
                }
                break;
            case Steps.Evaluation:
                break;
            default:
                break;
        }
    }
    
    const callAPI = async() => {
        const datasetJSON = await convertDatasetToJSON(datasetFile)

        const response = await axios.post('http://localhost:5050/train_model', {
            modelName,
            problemType,
            datasetJSON,
            columnsDataType,
            algorithm,
            parametersValue
        })

        if (response.status === 200) {
            return response.data
        } else {
            throw new Error('Failed to fetch metrics')
        }

    }
    
    const convertDatasetToJSON = (file) => {
        return new Promise((resolve, reject) => {
            Papa.parse(file, {
                header: hasHeader,
                skipEmptyLines: true,
                complete: (results) => {
                    resolve(results.data)
                },
                error: (error) => {
                    reject(error)
                }
            })
        })    
    }

    return(
        <>
            <header className='bg-gray-800 h-20 flex items-center'>
                <strong className='text-3xl font-bold italic text-white ml-10 cursor-pointer' onClick={goHome}>LAREDO</strong>
                <CustomButton className='ml-auto mr-10' onClick={goModels}>Show available models</CustomButton>
            </header>
            { !hasStarted ?
                <div className='flex flex-col items-center justify-center'>
                    <h1 className='text-7xl font-bold text-center mt-12'>Welcome to model creation</h1>
                    <p className='text-xl text-center mt-6'>Start by defining your model's name and selecting its problem type</p>
                    <div className="flex flex-col items-start justify-center mt-12">
                        
                        <label htmlFor="modelName" className="text-2xl text-white mb-1">Name</label>
                        
                        <input 
                            id="modelName"
                            className='border border-white rounded bg-gray-800 text-lg text-white p-1 h-9 w-64'
                            type="text" 
                            placeholder="Enter your model's name..."
                            value={modelName}
                            onChange={(event) => setModelName(event.target.value)}
                        />
                        {modelNameError && <p className="text-red-500 mt-2">{modelNameError}</p>}

                        <label htmlFor="problemType" className="text-2xl text-white mb-1 mt-8">Problem type</label>
                        <select 
                            id="problemType" 
                            className='text-lg text-white rounded border border-white bg-gray-800 p-1 h-9 w-64'
                            value={problemType}
                            onChange={(event) => setProblemType(event.target.value)}
                        >
                            <option className='text-lg' value="">Select a problem type...</option>
                            {problemTypes.map((problemType, index) => (
                                <option className='text-lg' key={index} value={problemType}>{problemType}</option>
                            ))}
                        </select>
                        {problemTypeError && <p className="text-red-500 mt-2">{problemTypeError}</p>}

                    </div>

                    <CustomButton onClick={handleHasStarted} className='mt-16'>Start</CustomButton>
                </div>                    
            :
                <div className='flex justify-center mt-3'>
                    <div className='inline-flex w-3/4'>
                    <button className={`flex-1 border-2 rounded-l-lg ${activeButton === Steps.Dataset 
                            ? activeButtonStyle 
                            : inactiveButtonStyle}`}
                            onClick={() => handleActive(Steps.Dataset)}>
                            {Steps.Dataset}
                        </button>
                        <button className={`flex-1 border-2 border-l-0 ${activeButton === Steps.Preprocessing 
                            ? activeButtonStyle 
                            : inactiveButtonStyle}`}
                            onClick={() => handleActive(Steps.Preprocessing)}>
                            {Steps.Preprocessing}
                        </button>
                        <button className={`flex-1 border-2 border-l-0 ${activeButton === Steps.Algorithm 
                            ? activeButtonStyle 
                            : inactiveButtonStyle}`}
                            onClick={() => handleActive(Steps.Algorithm)}>
                            {Steps.Algorithm}
                        </button>
                        <button className={`flex-1 border-2 border-l-0 rounded-r-lg ${activeButton === Steps.Evaluation 
                            ? activeButtonStyle 
                            : inactiveButtonStyle}`}
                            onClick={() => handleActive(Steps.Evaluation)}>
                            {Steps.Evaluation}
                        </button>
                    </div>
                </div>
            }
            {activeButton === Steps.Dataset && 
                <DatasetUploading 
                    datasetFile={datasetFile}
                    setDatasetFile={setDatasetFile}
                    columnsDataType={columnsDataType}
                    setColumnsDataType={setColumnsDataType}
                    preview={preview}
                    setPreview={setPreview}
                    datasetUploaded={datasetUploaded}
                    setDatasetUploaded={setDatasetUploaded}
                    columns={columns}
                    setColumns={setColumns}
                    hasHeader={hasHeader}
                    setHasHeader={setHasHeader}
                    onNextStep={handleNextStep}
                />
            }
            {activeButton === Steps.Preprocessing && <DatasetPreprocessing />}
            {activeButton === Steps.Algorithm && 
                <ModelSelection 
                    algorithm={algorithm}
                    setAlgorithm={setAlgorithm}
                    parametersValue={parametersValue}
                    setParametersValue={setParametersValue}
                    problemType={problemType}  
                    onNextStep={handleNextStep}  
                />
            }
            {activeButton === Steps.Evaluation && 
                <ModelEvaluation 
                    metrics={metrics}
                />
            }
        </>
    )
}

export default ModelCreation