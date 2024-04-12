import React, { useState } from "react"
import { FileUploader } from "react-drag-drop-files"
import Papa from 'papaparse'

function DatasetUploading() {

    const [datasetFile, setDatasetFile] = useState(null)
    const [dataset, setDataset] = useState([])

    const handleChange = (file) => {
        setDatasetFile(file);
        Papa.parse(file, {
            header: true,
            skipEmptyLines: true,
            complete: function (results) {
                console.log(results.data)
                setDataset(results.data)
            },
        });
        console.log(dataset)
    }


    return(
        <>
            <div className='grid grid-cols-2 h-[66vh] w-full mt-12 '>
                <FileUploader handleChange={handleChange} name="file" types={['csv']} dropMessageStyle={{ marginRight: '-3rem', marginLeft: '3rem' }} hoverTitle={" "}>
                    <div className='flex items-center border-2 border-cyan-400 border-dashed cursor-pointer h-full ml-12 -mr-12'>
                        {datasetFile ? (
                                <p className='text-cyan-400 mx-auto text-center text-4xl'>{datasetFile.name}</p>
                            ) : (
                                <p className='text-cyan-400 mx-auto text-center text-4xl'>Upload or drop <br/>your dataset here</p>
                            )
                        }
                        
                    </div>
                </FileUploader>

                <div className='flex flex-col justify-center mr-28 text-right'>
                    <h1 className='text-5xl font-bold'>Upload your dataset</h1>
                </div>
            </div>
        </>
    )
}

export default DatasetUploading