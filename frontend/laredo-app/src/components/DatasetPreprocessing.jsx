import React, { useState } from 'react'
import CustomButton from './CustomButton'
import CustomModal from './CustomModal'
import preprocessingMethods from '../assets/preprocessingMethods.json'
import { validateAndParseParam } from '../utils/paramsUtils'

function DatasetPreprocessing({selectedMethods, setSelectedMethods, onNextStep}) {

    const [showModal, setShowModal] = useState(false)
    const [selectedCategory, setSelectedCategory] = useState('')
    const [selectedMethod, setSelectedMethod] = useState('')
    const [selectedParams, setSelectedParams] = useState({})
    const [errors, setErrors] = useState({})

    const openModal = () => {
        setShowModal(true)
    }

    const closeModal = () => {
        setErrors({})
        setShowModal(false)
    }

    const handleCellClick = (category, method, params) => {
        if (Object.keys(params).length > 0) {
            openModal()
            setSelectedCategory(category)
            setSelectedMethod(method)
            setSelectedParams(params)
        } else {
            setSelectedMethods({ ...selectedMethods, [method]: {} })
        }
    }

    const applyParams = () => {
        const validatedParams = {}
        let hasError = false
        const methodParams = preprocessingMethods[selectedCategory][selectedMethod]

        Object.entries(selectedParams).forEach(([paramName, value]) => {
            const param = methodParams[paramName]
            const { isValidParameter, parsedValue } = validateAndParseParam(paramName, value, param.type, param.enum)
            if (!isValidParameter) {
                setErrors(prevErrors => ({
                    ...prevErrors,
                    [paramName]: 'Input value'
                }))
                hasError = true
            } else {
                validatedParams[paramName] = parsedValue
            }
        })

        if (!hasError) {
            setSelectedMethods({ ...selectedMethods, [selectedMethod]: validatedParams })
            closeModal()
        }
    }

    const handleChange = (paramName, value) => {
        setSelectedParams({ ...selectedParams, [paramName]: value })
        setErrors(prevErrors => ({
            ...prevErrors,
            [paramName]: ''
        }))
    }

    return(
        <>
            <div className='flex flex-col items-center justify-center'>
                <h1 className='text-6xl font-bold mt-8'>Customize preprocessing pipeline</h1>
                <strong className='mt-5'>Click on the techniques you want to use and specify the parameters to construct your pipeline.</strong>
                <div className='grid grid-cols-2 w-3/4'>
                    <table className='border border-white mt-5 w-fit mx-auto'>
                        {Object.entries(preprocessingMethods).map(([category, methods]) => (
                            <React.Fragment key={category}>
                                <tbody>
                                    <tr>
                                        <td className='bg-gray-800 text-white font-bold px-5 py-1' colSpan='2'>{category.replace(/_/g, ' ')}</td>
                                    </tr>
                                    {Object.entries(methods).map(([method, params]) => (
                                        <tr key={method}>
                                            <td
                                                className='px-5 py-1 bg-gray-800 hover:bg-transparent cursor-pointer'
                                                onClick={() => handleCellClick(category, method, params)}
                                            >
                                                {method}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </React.Fragment>
                        ))}
                    </table>
                    <div className='flex flex-col items-center'>
                        <table className='bg-gray-800 border border-white mt-5 w-96'>
                            <thead>
                                <tr>
                                    <td className='text-white text-lg font-bold px-5 py-1'>Pipeline</td>
                                </tr>
                            </thead>
                            <tbody>
                            {Object.keys(selectedMethods).map((method, index) => (
                                <tr key={index}>
                                    <td className='px-5 py-1'>{method} {JSON.stringify(selectedMethods[method])}</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                        <CustomButton className='mt-5 mb-5 w-fit' onClick={onNextStep}>Choose your algorithm</CustomButton>
                    </div>

                </div>
            </div>

            <CustomModal isOpen={showModal} onClose={closeModal}>
                <h2 className='text-5xl text-white font-semibold'>{selectedMethod} Parameters</h2>
                {Object.entries(selectedParams).map(([paramName]) => (
                    <div className='flex flex-col mt-4' key={paramName}>
                        <label htmlFor={paramName} className='text-2xl mb-1'>
                            {paramName}
                        </label>
                        <input
                            type='text'
                            id={paramName}
                            className='text-xl border border-white bg-gray-800 rounded-md p-2'
                            onChange={(e) => handleChange(paramName, e.target.value)}
                        />
                        <strong className='text-red-500'>{errors[paramName]}</strong>
                    </div>
                ))}
                <CustomButton className='mt-6' onClick={applyParams}>Apply</CustomButton>
            </CustomModal>
        </>
    )
}

export default DatasetPreprocessing