import React from 'react'
import CustomButton from './CustomButton'

function ColumnTypeIndicator({columns}) {

    console.log('Columns Indicator:', columns)

    return(
        <>
            <div className='max-w-full ml-12 -mr-12 flex justify-center'>
                <table className='w-fit text-center'>
                    <tbody>
                        {columns.map((column, index) => (
                            <tr key={index}>
                                <td className='border-b border-gray-800 py-2 px-14'>{column}</td>
                                <td className='border-b border-gray-800 py-2 px-14'>
                                    <select className='text-white rounded border border-white bg-gray-800 py-1 w-fit'>
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
            <div className='fixed mt-40 justify-center right-12 flex flex-col text-right'>
                <h1 className='text-5xl font-bold'>Set column data type</h1>
                <strong className='mt-5'>
                    Select the data type for each column of your dataset.
                </strong>
                <div className='flex justify-end mt-5'>
                    <CustomButton className='w-fit'>Preprocess</CustomButton>
                </div>
            </div>
        </>
    )
}

export default ColumnTypeIndicator