import React, { useState } from 'react'
import { FileUploader } from 'react-drag-drop-files'
import Papa from 'papaparse'
import DatasetChecking from './DatasetChecking'
import ColumnTypeIndicator from './ColumnTypeIndicator'

function DatasetUploading() {

    const [datasetFile, setDatasetFile] = useState(null)
    const [preview, setPreview] = useState([])
    const [datasetUploaded, setDatasetUploaded] = useState(false)

    const handleChange = (file) => {
        setDatasetFile(file);
        Papa.parse(file, {
            header: true,
            skipEmptyLines: true,
            preview: 6,
            complete: function (results) {
                setPreview(results.data);
            },
        });   
    }

    const onConfirm = () => {
        setDatasetUploaded(true)
    }

    const onReject = () => {
        setDatasetFile(null)
    }

    return(
        <>
            <div className='grid grid-cols-2 h-[66vh] w-full mt-12'>
                {datasetUploaded ? (
                    <ColumnTypeIndicator/>
                ) : (
                    datasetFile ? (
                        <DatasetChecking preview={preview} onConfirm={onConfirm} onReject={onReject}/>
                    ) : (
                        <>
                            <FileUploader handleChange={handleChange} name="file" types={['csv']} dropMessageStyle={{ marginRight: '-3rem', marginLeft: '3rem' }} hoverTitle={" "}>
                                <div className='flex items-center border-2 border-cyan-400 border-dashed cursor-pointer h-full ml-12 -mr-12'>
                                    <p className='text-cyan-400 mx-auto text-center text-4xl'>Upload or drop <br/>your dataset here</p>    
                                </div>
                            </FileUploader>

                            <div className='flex flex-col justify-center mr-12 text-right'>
                                <h1 className='text-5xl font-bold'>Upload your dataset</h1>
                            </div>
                        </>
                    )
                )}
            </div>
        </>
    )
}

export default DatasetUploading