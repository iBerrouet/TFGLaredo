import React, { useState } from 'react'
import CustomButton from './CustomButton'

function ColumnTypeIndicator({columns, columnsDataType, setColumnsDataType, onReject}) {

    const handleDataTypeChange = (column, event) => {
        setColumnsDataType(prevState => ({
            ...prevState,
            [column]: event.target.value
        }))
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
                                        value={columnsDataType[index]}
                                        onChange={(event) => handleDataTypeChange(index, event)}
                                    >

                                        <option value="">Select a data type...</option>

                                        <option value="integer">Integer</option>
                                        <option value="double">Double</option>
                                        <option value="string">String</option>
                                        <option value="date">Date</option>
                                        <option value="datetime">DateTime</option>
                                    </select>
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
                    <CustomButton className='mr-6'>Preprocess</CustomButton>
                    <CustomButton onClick={onReject}>Cancel</CustomButton>
                </div>
            </div>
        </>
    )
}

export default ColumnTypeIndicator