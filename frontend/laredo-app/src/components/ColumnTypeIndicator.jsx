import React, { useEffect, useState } from 'react'
import axios from 'axios'
import CustomButton from './CustomButton'

function ColumnTypeIndicator({preview, columns, columnsDataType, setColumnsDataType, onConfirm, onReject}) {

    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = async () => {
        try {
            console.log(preview)
            const datasetJSON = preview
            const response = await axios.post('http://localhost:5050/column-types', {
                datasetJSON
            })
            setColumnsDataType(response.data)
        } catch (error) {
            console.error('Error fetching data:', error)
        }
    }
    const [errors, setErrors] = useState({})

    const handleDataTypeChange = (column, event) => {
        setColumnsDataType(prevState => ({
            ...prevState,
            [column]: event.target.value
        }))

        setErrors(errors => ({
            ...errors,
            [column]: ''
        }))
    }

    const handleOnConfirm = () => {
        const newErrors = {};

        for (let i = 0; i < columns.length; i++) {
            if (!columnsDataType[i]) {
                newErrors[i] = 'Please select a data type.';
            }
        }

        setErrors(newErrors)

        if (Object.keys(newErrors).length === 0) {
            onConfirm()
        }
    }


    return(
        <>
            <div className='max-w-full mx-auto flex justify-center'>
                <table className='w-fit text-center'>
                    <tbody>
                        {columns.map((column, index) => (
                            <tr key={index}>
                                <td className='border-b border-gray-800 py-2 px-14'>{column}</td>
                                <td className='border-b border-gray-800 py-2 px-14'>
                                    <select className='text-white rounded border border-white bg-gray-800 py-1 w-fit'
                                        value={columnsDataType[column]}
                                        onChange={(event) => handleDataTypeChange(column, event)}
                                    >

                                        <option value=''>Select a data type...</option>

                                        <option value='int64'>Integer</option>
                                        <option value='float64'>Float</option>
                                        <option value='object'>String</option>
                                        <option value='datetime64[ns]'>DateTime (ns)</option>
                                        <option value='datetime64[s]'>DateTime (s)</option>
                                    </select>
                                    {errors[index] && (
                                        <p className='text-red-500'>{errors[index]}</p>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className='fixed top-1/2 left-1/2 translate-x-1/4 justify-center flex flex-col text-right'>
                <h1 className='text-5xl font-bold'>Set column data type</h1>
                <strong className='mt-5'>
                    Select the data type for each column of your dataset.
                </strong>
                <div className='flex justify-end mt-5'>
                    <CustomButton className='mr-6' onClick={handleOnConfirm}>Choose target</CustomButton>
                    <CustomButton onClick={onReject}>Cancel</CustomButton>
                </div>
            </div>
        </>
    )
}

export default ColumnTypeIndicator