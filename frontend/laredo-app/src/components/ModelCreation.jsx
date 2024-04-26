import React, { useState } from 'react'
import { useNavigate, Route, Routes } from 'react-router-dom'
import CustomButton from './CustomButton'
import DatasetPreprocessing from './DatasetPreprocessing'
import DatasetUploading from './DatasetUploading'
import ModelSelection from './ModelSelection'
import ModelEvaluation from './ModelEvaluation'
import Papa from 'papaparse'
import axios from 'axios'

const Steps = {
    Dataset: 'Dataset',
    Preprocessing: 'Preprocessing',
    Algorithm: 'Algorithm',
    Evaluation: 'Evaluation'
}


function ModelCreation() {
    const [activeButton, setActiveButton] = useState(Steps.Dataset)
    const [datasetFile, setDatasetFile] = useState(null)
    const [columnsDataType, setColumnsDataType] = useState({})
    const [preview, setPreview] = useState([])
    const [datasetUploaded, setDatasetUploaded] = useState(false)
    const [columns, setColumns] = useState([])
    const [hasHeader, setHasHeader] = useState(true)

    const [algorithm, setAlgorithm] = useState("")
    const [parametersValue, setParametersValue] = useState({})

    const navigate = useNavigate()

    const activeButtonStyle = 'bg-transparent text-cyan-400 font-bold text-lg py-2 w-40'
    const inactiveButtonStyle = 'bg-gray-900 hover:bg-transparent hover:text-cyan-400 text-white text-lg  py-2 w-40'

    const goHome = () => {
        navigate('/')
    }

    const goModels = () => {
        navigate('/models')
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
                    await callAPI();
                } catch (error) {
                    console.error('Incorrect API call:', error);
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
        await axios.post('http://localhost:5050/train_model', {
            datasetJSON,
            columnsDataType,
            algorithm,
            parametersValue
        })
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
                    onNextStep={handleNextStep}  
                />
            }
            {activeButton === Steps.Evaluation && <ModelEvaluation />}
        </>
    )
}

export default ModelCreation