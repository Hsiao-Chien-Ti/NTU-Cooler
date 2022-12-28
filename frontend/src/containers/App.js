import '../App.css'
import {useAll} from './hooks/useAll'
import styled from 'styled-components';
import SignIn from './SignIn'
import TMP from '../tmp'
const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
    width: 500px;
    margin: auto;`

const App = () => {
    const {signedIn} = useAll()
    return (
        <Wrapper>
            {signedIn ? <TMP /> : <SignIn />}
        </Wrapper>
    )
}

export default App
