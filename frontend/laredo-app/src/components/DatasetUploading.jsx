import React, { useState } from "react"
import { FileUploader } from "react-drag-drop-files"
import Papa from 'papaparse'
import CustomButton from "./CustomButton"

function DatasetUploading() {

    const [datasetFile, setDatasetFile] = useState(null)
    const [preview, setPreview] = useState([])

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

    


    return(
        <>
            <div className='grid grid-cols-2 h-[66vh] w-full mt-12'>
                {datasetFile ? (
                    <>
                        <div className='max-w-full overflow-x-auto ml-12 -mr-12'>
                            <table className='w-full'>
                                <thead className='text-white font-bold border-t border-white'>
                                    <tr>
                                        {preview.length > 0 && Object.keys(preview[0]).map((column, index) => (
                                            <th key={index} className='border-l border-r border-white'>{column}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {preview.map((row, rowIndex) => (
                                        <tr key={rowIndex}>
                                            {Object.values(row).map((value, columnIndex) => (
                                                <td key={columnIndex} className='border-l border-r border-white'>{value}</td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className='flex flex-col justify-center mr-12 text-right'>
                            <h1 className='text-5xl font-bold'>Check uploaded dataset</h1>
                            <strong className='text mt-5'>
                                Check that this is the dataset you want to use.<br/>
                                Is this the right one?
                            </strong>
                            <div className='flex justify-end mt-5'>
                                <CustomButton className=' text-xl w-36 mr-6'>Yes</CustomButton>
                                <CustomButton className='text-xl w-36'>No</CustomButton>
                            </div>
                        </div>
                    </>
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
                )}
            </div>
        </>
    )
}

export default DatasetUploading