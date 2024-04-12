import React, { useState } from 'react'
import CustomButton from './CustomButton'
import AdvancedModelSelection from './AdvancedModelSelection'
import BasicModelSelection from './BasicModelSelection'
import { useNavigate } from 'react-router-dom'


function ModelSelection() {

    const [showAdvance, setShowAdvance] = useState(false)
    const navigate = useNavigate()

    const goHome = () => {
        navigate('/')
    };

    const goModels = () => {
        navigate('/models')
    }

    return(
        <>
            <header className='bg-gray-800 h-20 flex items-center'>
                <strong className='text-3xl font-bold italic text-white ml-10 cursor-pointer' onClick={goHome}>LAREDO</strong>
                <CustomButton className='ml-auto mr-10' onClick={goModels}>Mostrar modelos disponibles</CustomButton>
            </header>

            <div className='flex justify-center items-center mt-12'>
            <button onClick={() => setShowAdvance(false)} className={ showAdvance 
                    ? 'bg-gray-900 hover:bg-transparent hover:text-cyan-400 text-white text-[16px] py-2 w-40 border-2 border-r rounded-l'
                    : 'bg-transparent text-cyan-400 text-[16px] py-2 w-40 border-2 border-r rounded-l'}>
                    Basica
                </button>
                <button onClick={() => setShowAdvance(true)} className={showAdvance 
                    ? 'bg-transparent text-cyan-400 text-[16px] py-2 w-40 border-2 border-l rounded-r'
                    : 'bg-gray-900 hover:bg-transparent hover:text-cyan-400 text-white text-[16px] py-2 w-40 border-2 border-l rounded-r'}>
                    Avanzada
                </button>

            </div>

            {showAdvance ? <AdvancedModelSelection /> : <BasicModelSelection />}
        </>
    )
}

export default ModelSelection