import React, { useState } from 'react'
import algorithmData from '../assets/algorithmParameters.json'
import CustomButton from './CustomButton'

function AdvancedModelSelection() {

    const [selectedAlgorithm, setSelectedAlgorithm] = useState("")

    const handleSelectAlgorithm = (event) => {
        setSelectedAlgorithm(event.target.value);
    }

    return(
        <>
            <div className='grid grid-cols-2'>
                <div>
                    <div className='flex justify-center items-center mt-12'>

                        <strong className='mr-4 text-2xl'>Algorithm:</strong>
                        <select className='text-white rounded border border-white bg-gray-800 py-1 text-xl w-fit' 
                            value={selectedAlgorithm} onChange={handleSelectAlgorithm}>

                            <option value="">Select an algorithm...</option>

                            {Object.keys(algorithmData).map((algorithmName) => (
                                <option key={algorithmName} value={algorithmName}>
                                    {algorithmName}
                                </option>
                            ))}

                        </select>
                            
                    </div>
                    <div className="flex justify-center items-center mt-6">
                        {selectedAlgorithm && (
                            <div>
                            <h2 className='mt-5 text-xl'>Parameters:</h2>
                            <table className='mt-5 bg-transparent border-white w-full'>
                                <tbody>
                                    {Object.keys(algorithmData[selectedAlgorithm].parameters).map((parameterName) => {
                                        const defaultValue = algorithmData[selectedAlgorithm].parameters[parameterName].default;
                                        return (
                                            <tr key={parameterName}>
                                                <td  className='text-left border-0 border-b-2 border-gray-800 py-2'>{parameterName}</td>
                                                <td className='border-0 border-b-2 border-gray-800 py-2'>
                                                    <input 
                                                        className='border border-white rounded bg-transparent text-white'
                                                        type="text" 
                                                        value={defaultValue} 
                                                    />
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                            </div>
                        )}
                    </div>
                </div>

                <div className='fixed top-1/2 left-1/2 translate-x-1/4 text-right'>
                    <h2 className='text-5xl font-bold'>Model creation</h2>
                    <h1 className='text-6xl font-bold'>Advanced</h1>
                    <strong className='mt-5'>Set the model parameters once the algorithm is chosen.</strong>
                    <div className="ml-auto mt-6">
                        <CustomButton className='w-fit text-lg'>Train your model</CustomButton>
                    </div>
                </div>
            </div>
        </>
    )
}
export default AdvancedModelSelection
