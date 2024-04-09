import React, { useState } from 'react'
import algorithmData from '../assets/algorithmParameters.json'

function AdvancedModelCreation() {

    const [selectedAlgorithm, setSelectedAlgorithm] = useState("")

    const handleSelectAlgorithm = (event) => {
        setSelectedAlgorithm(event.target.value);
    }

    return(
        <>
            <div className='grid grid-cols-2'>
                <div>
                    <div className='flex justify-center items-center mt-12'>
                        <strong className='mr-4'>Algoritmo:</strong>
                        <select className='text-white rounded border border-white bg-gray-800 w-60 h-6' value={selectedAlgorithm} onChange={handleSelectAlgorithm}>
                            <option value="">Selecciona un algoritmo...</option>
                            {Object.keys(algorithmData).map((algorithmName) => (
                            <option key={algorithmName} value={algorithmName}>
                                {algorithmName}
                            </option>
                            ))}
                        </select>
                            
                    </div>
                    <div className="flex justify-center items-center mt-6">
                        <p>Param</p>
                        <p>Valor</p>
                    </div>
                </div>
                
                <div className='flex flex-col text-right mt-36 mr-28'>
                    <h2 className='text-5xl font-bold'>Creación de modelos</h2>
                    <h1 className='text-6xl font-bold'>Avanzada</h1>
                    <p className='mt-5'>Establezca los parámetros del módelo una vez elegido el algoritmo.</p>
                </div>
            </div>
        </>
    )
}

export default AdvancedModelCreation