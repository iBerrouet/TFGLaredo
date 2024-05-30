import React, { useState } from 'react'
import CustomButton from './CustomButton'

function TargetIndicator({columns, target, setTarget, onNextStep, onReject}) {

    const [error, setError] = useState(null)

    const handleOnNextStep = () => {
        if (!target) {
            setError('Please choose a target column')
        } else {
            onNextStep()
        }
    }

    return(
        <>
            <div className='max-w-full mx-auto flex flex-col items-center justify-center'>

                {error && (<p className='text-red-500'>{error}</p>)}
                <table className='w-fit text-center'>
                    <tbody>
                        {columns.map((column, index) => (
                            <tr key={index}>
                                <td className='border-b border-gray-800 py-2 px-8'>
                                    <label htmlFor={column}>{column}</label>
                                    <input
                                        className='ml-4'
                                        type='radio'
                                        id={column}
                                        value={column}
                                        name={'target'}
                                        onClick={() => setTarget(column)}
                                    />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className='fixed top-1/2 left-1/2 translate-x-1/4 justify-center flex flex-col text-right'>
                <h1 className='text-5xl font-bold'>Select column target</h1>
                <strong className='mt-5'>
                    Choose the target column for yout dataset analysis.
                </strong>
                <div className='flex justify-end mt-5'>
                    <CustomButton className='mr-6' onClick={handleOnNextStep}>Preprocess</CustomButton>
                    <CustomButton onClick={onReject}>Cancel</CustomButton>
                </div>
            </div>
        </>
    )
}

export default TargetIndicator