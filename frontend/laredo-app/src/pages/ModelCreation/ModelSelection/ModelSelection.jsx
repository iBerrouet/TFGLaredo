import React, { useState } from 'react'
import AdvancedModelSelection from '@pages/ModelCreation/ModelSelection/AdvancedModelSelection'
import BasicModelSelection from '@pages/ModelCreation/ModelSelection/BasicModelSelection'


function ModelSelection({algorithm, setAlgorithm, parametersValue, setParametersValue, problemType, onNextStep}) {

    const [showAdvance, setShowAdvance] = useState(false)

    return(
        <>
            <div className='flex justify-center items-center mt-7'>
                <button onClick={() => setShowAdvance(false)} className={ showAdvance 
                    ? 'bg-gray-900 hover:bg-transparent hover:text-cyan-400 text-white text-[16px] py-2 w-40 border-2 border-r rounded-l'
                    : 'bg-transparent text-cyan-400 text-[16px] py-2 w-40 border-2 border-r rounded-l'}>
                    Basic
                </button>
                <button onClick={() => setShowAdvance(true)} className={showAdvance 
                    ? 'bg-transparent text-cyan-400 text-[16px] py-2 w-40 border-2 border-l rounded-r'
                    : 'bg-gray-900 hover:bg-transparent hover:text-cyan-400 text-white text-[16px] py-2 w-40 border-2 border-l rounded-r'}>
                    Advanced
                </button>

            </div>

            {showAdvance ? 
                <AdvancedModelSelection 
                    algorithm={algorithm}
                    setAlgorithm={setAlgorithm}
                    parametersValue={parametersValue}
                    setParametersValue={setParametersValue}
                    problemType={problemType}
                    onNextStep={onNextStep}
                /> 
                : 
                <BasicModelSelection />
            }
        </>
    )
}

export default ModelSelection