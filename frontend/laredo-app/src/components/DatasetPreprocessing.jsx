import React, { useState } from "react"
import CustomButton from "./CustomButton"

function DatasetPreprocessing() {

    const [selectedMethods, setSelectedMethods] = useState({})

    const handleCellClick = (method, params) => {
        setSelectedMethods({ ...selectedMethods, [method]: params })
    }
    

    return(
        <>
            <div className='flex flex-col items-center justify-center'>
                <h1 className='text-6xl font-bold mt-12'>Customize preprocessing pipeline</h1>
                <strong className='mt-5'>Click on the techniques you want to use and specify the parameters to construct your pipeline.</strong>
                <div className='grid grid-cols-2 place-items-center w-3/4'>
                    <table className=' bg-gray-800 border border-white mt-5 '>
                        <tbody>
                        <tr>
                                <td className="text-white font-bold px-5 py-1" colSpan="2">Scale and Encode Features</td>
                            </tr>
                            <tr>
                                <td className="px-5 py-1" onClick={() => handleCellClick('minmax scaler', { min: 0, max: 1 })}>minmax scaler</td>
                            </tr>
                            <tr>
                                <td className="px-5 py-1" onClick={() => handleCellClick('target encoder')}>target encoder</td>
                            </tr>
                            <tr>
                                <td className="px-5 py-1" onClick={() => handleCellClick('normalizer')}>normalizer</td>
                            </tr>
                            <tr>
                                <td className="px-5 py-1" onClick={() => handleCellClick('standard scaler')}>standard scaler</td>
                            </tr>
                            <tr>
                                <td className="px-5 py-1" onClick={() => handleCellClick('one hot encoder')}>one hot encoder</td>
                            </tr>
                            <tr>
                                <th className='text-white font-bold px-5 py-1' colSpan="2">Reduce Columns</th>
                            </tr>
                            <tr>
                                <td className="px-5 py-1" onClick={() => handleCellClick('selectkbest')}>selectkbest</td>
                            </tr>
                            <tr>
                                <td className="px-5 py-1" onClick={() => handleCellClick('pca')}>pca</td>
                            </tr>
                            <tr>
                                <th className='text-white font-bold px-5 py-1' colSpan="2">Fill Empty Rows</th>
                            </tr>
                            <tr>
                                <td className="px-5 py-1" onClick={() => handleCellClick('SimpleImputer')}>SimpleImputer</td>
                            </tr>
                            <tr>
                                <td className="px-5 py-1" onClick={() => handleCellClick('Ffill')}>Ffill</td>
                            </tr>
                            <tr>
                                <td className="px-5 py-1" onClick={() => handleCellClick('Bfill')}>Bfill</td>
                            </tr>
                        </tbody>
                    </table>
                    <table className='bg-gray-800 border border-white mt-5 w-96'>
                        <thead>
                            <tr>
                                <td className='text-white font-bold px-5 py-1'>Pipeline</td>
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
                </div>
                <CustomButton className='mt-5 mb-5'>Choose your algorithm</CustomButton>
            </div>
        </>
    )
}

export default DatasetPreprocessing