import React, { useState } from "react"
import CustomButton from "./CustomButton"
import CustomModal from "./CustomModal"

function DatasetPreprocessing({selectedMethods, setSelectedMethods, onNextStep}) {

    const [showModal, setShowModal] = useState(false)
    const [selectedParams, setSelectedParams] = useState({ param1: "", param2: "" })

    const openModal = () => {
        setShowModal(true)
    }

    const closeModal = () => {
        setShowModal(false)
    }

    const handleCellClick = (method, params) => {
        if (params) {
            openModal()
            setSelectedParams(params)
        } else {
            setSelectedMethods({ ...selectedMethods, [method]: {} })
        }
    }

    const applyParams = () => {
        setSelectedMethods({ ...selectedMethods, ['minmax scaler']: selectedParams })
        closeModal()
    }

    const handleChange = (paramName, value) => {
        setSelectedParams({ ...selectedParams, [paramName]: null });
    }

    return(
        <>
            <div className='flex flex-col items-center justify-center'>
                <h1 className='text-6xl font-bold mt-8'>Customize preprocessing pipeline</h1>
                <strong className='mt-5'>Click on the techniques you want to use and specify the parameters to construct your pipeline.</strong>
                <div className='grid grid-cols-2 w-3/4'>
                    <table className='border border-white mt-5 w-fit mx-auto'>
                        <tbody>
                            <tr>
                                <td className="bg-gray-800 text-white font-bold px-5 py-1" colSpan="2">Scale and Encode Features</td>
                            </tr>
                            <tr>
                                <td className="px-5 py-1 bg-gray-800 hover:bg-transparent cursor-pointer" onClick={() => handleCellClick('minmax scaler', { min: 0, max: 1 })}>minmax scaler</td>
                            </tr>
                            <tr>
                                <td className="px-5 py-1 bg-gray-800 hover:bg-transparent cursor-pointer" onClick={() => handleCellClick('target encoder')}>target encoder</td>
                            </tr>
                            <tr>
                                <td className="px-5 py-1 bg-gray-800 hover:bg-transparent cursor-pointer" onClick={() => handleCellClick('normalizer')}>normalizer</td>
                            </tr>
                            <tr>
                                <td className="px-5 py-1 bg-gray-800 hover:bg-transparent cursor-pointer" onClick={() => handleCellClick('standard scaler')}>standard scaler</td>
                            </tr>
                            <tr>
                                <td className="px-5 py-1 bg-gray-800 hover:bg-transparent cursor-pointer" onClick={() => handleCellClick('one hot encoder')}>one hot encoder</td>
                            </tr>
                            <tr>
                                <th className='bg-gray-800 text-white font-bold px-5 py-1' colSpan="2">Reduce Columns</th>
                            </tr>
                            <tr>
                                <td className="px-5 py-1 bg-gray-800 hover:bg-transparent cursor-pointer" onClick={() => handleCellClick('selectkbest')}>selectkbest</td>
                            </tr>
                            <tr>
                                <td className="px-5 py-1 bg-gray-800 hover:bg-transparent cursor-pointer" onClick={() => handleCellClick('pca')}>pca</td>
                            </tr>
                            <tr>
                                <th className='bg-gray-800 text-white font-bold px-5 py-1' colSpan="2">Fill Empty Rows</th>
                            </tr>
                            <tr>
                                <td className="px-5 py-1 bg-gray-800 hover:bg-transparent cursor-pointer" onClick={() => handleCellClick('SimpleImputer')}>SimpleImputer</td>
                            </tr>
                            <tr>
                                <td className="px-5 py-1 bg-gray-800 hover:bg-transparent cursor-pointer" onClick={() => handleCellClick('Ffill')}>Ffill</td>
                            </tr>
                            <tr>
                                <td className="px-5 py-1 bg-gray-800 hover:bg-transparent cursor-pointer" onClick={() => handleCellClick('Bfill')}>Bfill</td>
                            </tr>
                        </tbody>
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
                                    <td className="px-5 py-1">{method} {JSON.stringify(selectedMethods[method])}</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                        <CustomButton className='mt-5 mb-5 w-fit' onClick={onNextStep}>Choose your algorithm</CustomButton>
                    </div>

                </div>
            </div>

            <CustomModal isOpen={showModal} onClose={closeModal}>
                <h2 className="text-5xl text-white font-semibold">Select Parameters</h2>
                <div className="flex flex-col mt-4">
                    <label htmlFor="param1" className="text-2xl mb-1">
                        Parameter 1:
                    </label>
                    <input
                        type="text"
                        id="param1"
                        className="text-xl border border-white bg-gray-800 rounded-md p-2"
                        value={selectedParams.param1}
                        onChange={(e) => handleChange("param1", e.target.value)}
                    />
                </div>
                <div className="flex flex-col mt-4">
                    <label htmlFor="param2" className="text-2xl mb-1">
                        Parameter 2:
                    </label>
                    <input
                        type="text"
                        id="param2"
                        className="text-xl border border-white bg-gray-800 rounded-md p-2"
                        value={selectedParams.param2}
                        onChange={(e) => handleChange("param2", e.target.value)}
                    />
                </div>

                <CustomButton className='mt-6' onClick={applyParams}>Apply</CustomButton>
            </CustomModal>
        </>
    )
}

export default DatasetPreprocessing