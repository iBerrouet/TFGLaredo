import React from "react"
import { useNavigate } from 'react-router-dom'
import CustomButton from "./CustomButton"

function ModelEvaluation() {

    const navigate = useNavigate()

    const goHome = () => {
        navigate('/')
    }

    return(
        <>
            <div className='grid grid-cols-2 h-[70vh] w-full'>
                <div className='flex flex-col justify-center items-center'>
                    <table className='bg-gray-800 border-white'>
                        <thead className='text-white'>
                            <th className='border-b'>
                                <td className='w-36'>Metric</td>
                                <td className='w-36'>Value</td>
                            </th>
                        </thead>
                        <tbody>
                            
                        </tbody>
                    </table>
                </div>
                <div className='flex flex-col justify-center items-end text-right mx-auto'>
                    <h1 className='text-6xl font-bold'>Evaluate your model</h1>
                    <strong className='mt-5'>Explore metrics of the generated model for informed analysis.</strong>
                    <CustomButton className='text-lg mt-5 w-fit' onClick={goHome}>Finish</CustomButton>
                </div>
            </div>
        </>
    )
}

export default ModelEvaluation