import React, { useState } from 'react'
import { useNavigate, Route, Routes } from 'react-router-dom'
import CustomButton from './CustomButton'
import DatasetPreprocessing from './DatasetPreprocessing'
import DatasetUploading from './DatasetUploading'
import ModelSelection from './ModelSelection'
import ModelEvaluation from './ModelEvaluation'

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

    const [algorithm, setAlgorithm] = useState("")
    const [parametersValue, setParametersValue] = useState({})

    const navigate = useNavigate()

    const goHome = () => {
        navigate('/')
    }

    const goModels = () => {
        navigate('/models')
    }

    const handleActive = (step) => {
        setActiveButton(step)
    }

    return(
        <>
            <header className='bg-gray-800 h-20 flex items-center'>
                <strong className='text-3xl font-bold italic text-white ml-10 cursor-pointer' onClick={goHome}>LAREDO</strong>
                <CustomButton className='ml-auto mr-10' onClick={goModels}>Show available models</CustomButton>
            </header>
            <div className='flex justify-center mt-3'>
                <div className='inline-flex w-3/4'>
                    <button className={`flex-1 ${activeButton == Steps.Dataset 
                        ? 'bg-transparent text-cyan-400 text-lg py-2 w-40 border-2 border-r rounded-l' 
                        : 'bg-gray-900 hover:bg-transparent hover:text-cyan-400 text-white text-lg font-bold py-2 w-40 border-2 rounded-l-lg border-r'}`}
                        onClick={() => handleActive(Steps.Dataset)}>
                        {Steps.Dataset}
                    </button>
                    <button className={`flex-1 ${activeButton == Steps.Preprocessing 
                        ? 'bg-transparent text-cyan-400 text-lg py-2 w-40 border-2 border-l border-r' 
                        : 'bg-gray-900 hover:bg-transparent hover:text-cyan-400 text-white text-lg font-bold py-2 w-40 border-2 border-l border-r'}`}
                        onClick={() => handleActive(Steps.Preprocessing)}>
                        {Steps.Preprocessing}
                    </button>
                    <button className={`flex-1 ${activeButton == Steps.Algorithm 
                        ? 'bg-transparent text-cyan-400 text-lg py-2 w-40 border-2 border-l border-r' 
                        : 'bg-gray-900 hover:bg-transparent hover:text-cyan-400 text-white text-lg font-bold py-2 w-40 border-2 border-l border-r'}`}
                        onClick={() => handleActive(Steps.Algorithm)}>
                        {Steps.Algorithm}
                    </button>
                    <button className={`flex-1 ${activeButton == Steps.Evaluation 
                        ? 'bg-transparent text-cyan-400 text-lg py-2 w-40 border-2 rounded-r-lg border-l' 
                        : 'bg-gray-900 hover:bg-transparent hover:text-cyan-400 text-white text-lg font-bold py-2 w-40 border-2 rounded-r-lg border-l'}`}
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
                />
            }
            {activeButton === Steps.Preprocessing && <DatasetPreprocessing />}
            {activeButton === Steps.Algorithm && 
                <ModelSelection 
                    algorithm={algorithm}
                    setAlgorithm={setAlgorithm}
                    parametersValue={parametersValue}
                    setParametersValue={setParametersValue}    
                />
            }
            {activeButton === Steps.Evaluation && <ModelEvaluation />}
        </>
    )
}

export default ModelCreation