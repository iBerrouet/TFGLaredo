import React, { useState } from 'react'
import { FileUploader } from 'react-drag-drop-files'
import Papa from 'papaparse'
import DatasetChecking from './DatasetChecking'
import ColumnTypeIndicator from './ColumnTypeIndicator'
import uploadIcon from '../assets/uploadIcon.svg' 

function DatasetUploading({datasetFile, setDatasetFile, columnsDataType, setColumnsDataType, preview, setPreview,
                            datasetUploaded, setDatasetUploaded, columns, setColumns, onNextStep}) {

    const handleChange = (file) => {
        setDatasetFile(file)
        Papa.parse(file, {
            header: true,
            skipEmptyLines: true,
            preview: 6,
            complete: function (results) {
                setPreview(results.data)
                const columns = results.meta.fields
                setColumns(columns)
                const initialColumnsDataType = {};
                columns.forEach(column => {
                    initialColumnsDataType[column] = ''
                })
                setColumnsDataType(initialColumnsDataType)
            },
        })
    }

    const onConfirm = () => {
        setDatasetUploaded(true)
    }

    const onReject = () => {
        setDatasetUploaded(false)
        setDatasetFile(null)
        setColumnsDataType({});
    }

    return(
        <>
            <div className='grid grid-cols-2 h-[66vh] w-full mt-12'>
                {datasetUploaded ? (
                    <ColumnTypeIndicator columns={columns} columnsDataType={columnsDataType} setColumnsDataType={setColumnsDataType} onReject={onReject} onNextStep={onNextStep}/>
                ) : (
                    datasetFile ? (
                        <DatasetChecking preview={preview} onConfirm={onConfirm} onReject={onReject}/>
                    ) : (
                        <>
                            <FileUploader handleChange={handleChange} name="file" types={['csv']} dropMessageStyle={{ marginRight: 'auto', marginLeft: 'auto', width: '91.666667%' }} hoverTitle={" "}>
                                <div className='flex flex-col justify-center items-center border-2 border-dashed rounded-md border-cyan-400 cursor-pointer h-full w-11/12 mx-auto bg-gray-800'>
                                    <img src={uploadIcon} alt='Upload file icon' className='w-20 h-20'/>
                                    <strong className='text-white mx-auto text-center text-4xl mt-12'>Drop your dataset here <br/>or click to upload</strong>  
                                    <p className='mt-3'>Support: *.csv</p>  
                                </div>
                            </FileUploader>

                            <div className='flex flex-col justify-center mx-auto text-right'>
                                <h1 className='text-5xl font-bold'>Choose your dataset</h1>
                                <strong className='mt-5'>Upload your dataset to start building your model.</strong>
                            </div>
                        </>
                    )
                )}
            </div>
        </>
    )
}

export default DatasetUploading