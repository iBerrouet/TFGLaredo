import React, { useState } from 'react'
import { FileUploader } from 'react-drag-drop-files'
import Papa from 'papaparse'
import DatasetChecking from './DatasetChecking'
import ColumnTypeIndicator from './ColumnTypeIndicator'

function DatasetUploading({datasetFile, setDatasetFile, columnsDataType, setColumnsDataType, preview, setPreview,
                            datasetUploaded, setDatasetUploaded, columns, setColumns}) {

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
        setDatasetFile(null)
        setColumnsDataType({});
    }

    return(
        <>
            <div className='grid grid-cols-2 h-[66vh] w-full mt-12'>
                {datasetUploaded ? (
                    <ColumnTypeIndicator columns={columns} columnsDataType={columnsDataType} setColumnsDataType={setColumnsDataType}/>
                ) : (
                    datasetFile ? (
                        <DatasetChecking preview={preview} onConfirm={onConfirm} onReject={onReject}/>
                    ) : (
                        <>
                            <FileUploader handleChange={handleChange} name="file" types={['csv']} dropMessageStyle={{ marginRight: 'auto', marginLeft: 'auto', width: '91.666667%' }} hoverTitle={" "}>
                                <div className='flex items-center border-2 border-cyan-400 border-dashed cursor-pointer h-full w-11/12 mx-auto'>
                                    <p className='text-cyan-400 mx-auto text-center text-4xl'>Upload or drop <br/>your dataset here</p>    
                                </div>
                            </FileUploader>

                            <div className='flex flex-col justify-center mx-auto text-right'>
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