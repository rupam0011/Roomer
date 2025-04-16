
import { Box } from '@mui/material'
import Header from './Header'
import { Footer } from './Footer'

const Wrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <Header />
      <Box sx={{ paddingTop: '48px', }}>
        {children}
      </Box>
      <Footer/>

    </div>
  )
}

export default Wrapper