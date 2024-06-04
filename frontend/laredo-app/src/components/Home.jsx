import { useNavigate } from 'react-router-dom'
import CustomButton from './CustomButton'
import robot from '../assets/robot.png'

function Home() {

  const navigate = useNavigate()
  
  const goModelCreation = () => {
    navigate('/model-creation')
  }

  const goModels = () => {
      navigate('/models')
  }

  return (
    <div className='grid h-screen w-screen grid-cols-3'>
      <div className='col-span-2 flex flex-col justify-center text-left mx-auto h-full'>
        <h1 className='text-[200px] font-bold italic text-white -mt-24'>LAREDO</h1>
        <p className='text-[40px] text-cyan-400 -mt-4'>
          Predict the future with confidence: <br/>
          Create and Apply Predictive Models intuitively.
        </p>
        <div className='flex mt-8'>
          <CustomButton onClick={goModelCreation}>Create a model</CustomButton>
          <CustomButton className='ml-4' onClick={goModels}>Show available models</CustomButton>
        </div>
      </div>
      <div className='flex items-center justify-end'>
        <img src={robot} alt='A robot for home page' className='h-screen' />
      </div>
    </div>
  )
}

export default Home
