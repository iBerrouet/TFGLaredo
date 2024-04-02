import { useNavigate } from 'react-router-dom'
import CustomButton from './CustomButton'
import robot from '../assets/robot.png'

function Home() {

  const navigate = useNavigate()
 
  const goModels = () => {
      navigate('/models')
  }

  return (
    <div className=''>
      <div className='my-16 ps-12'>
        <h2 className='text-[100px] font-bold text-cyan-400'>HERRAMIENTA</h2>
        <h1 className='text-[200px] font-bold italic text-white -mt-24'>LAREDO</h1>
        <p className='text-[40px] text-cyan-400 -mt-4'>Predice el futuro con confianza: <br/>
        Crea y Aplica Modelos Predictivos de forma Intuitiva.</p>
        <CustomButton className='mt-8'>Crear un modelo</CustomButton>
        <CustomButton className='ml-4' onClick={goModels}>Mostrar modelos disponibles</CustomButton>
      </div>
      <div>
        <img src={robot} alt='A robot for home page' className='absolute right-0 top-0 h-screen '/>
      </div>
    </div>
  );
}

export default Home
