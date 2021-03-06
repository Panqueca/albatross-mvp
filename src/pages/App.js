import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import React, { Suspense, useEffect } from 'react'
import { HashRouter as Router, Switch } from 'react-router-dom'
import styled from 'styled-components'
import { routes } from './routes'
import { CHAIN_ID, metamaskParams, provider } from 'constants/provider'
import Header from 'components/Header'
import ModalProvider from 'components/ModalProvider'
import ProtectedRoute from 'components/ProtectedRoute'
import RouletteProvider from 'components/RouletteProvider'
import { useAccountState } from '../store/account/state'
import EventProvider from 'contracts/EventProvider'

const AppWrapper = styled.div`
  display: flex;
  flex-flow: column;
  align-items: flex-start;
`

const BodyWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 5rem 1rem;
  padding-top: 125px;
  align-items: center;
  flex: 1;
  z-index: 1;

  ${({ theme }) => theme.mediaWidth.upToSmall`
    padding: 5rem 1rem;
  `};
`

const HeaderWrapper = styled.div`
  ${({ theme }) => theme.flexRowNoWrap}
  width: 100%;
  justify-content: space-between;
  position: fixed;
  top: 0;
  z-index: 2;
`

function App() {
  const { setLogged, setAddress } = useAccountState()

  async function setSigner() {
    const signer = provider.getSigner()
    const newAddress = await signer.getAddress()
    if (newAddress) {
      console.log('Account:', newAddress)
      setLogged(true)
      setAddress(newAddress)
    }
  }

  useEffect(() => {
    async function start() {
      await provider.send('eth_requestAccounts', [])
      try {
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: metamaskParams,
        })

        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: CHAIN_ID }],
        })
        setSigner()
      } catch (err) {
        console.log({ err })
      }

      provider.on('network', (newNetwork, oldNetwork) => {
        if (oldNetwork) window.location.reload()
      })
      window.ethereum.on('accountsChanged', () => {
        window.location.reload()
      })
    }

    start()
    // eslint-disable-next-line
  }, [])

  return (
    <Suspense fallback={null}>
      <Router>
        <AppWrapper>
          <ModalProvider />
          <EventProvider />
          <RouletteProvider />

          <HeaderWrapper>
            <Header />
          </HeaderWrapper>

          <BodyWrapper gap="lg" justify="center">
            <Switch>
              {routes.map(({ path, component, authRequired, exact }) => {
                return (
                  <ProtectedRoute
                    key={path}
                    path={path}
                    component={component}
                    authRequired={authRequired}
                    exact={exact}
                  />
                )
              })}
            </Switch>
          </BodyWrapper>
        </AppWrapper>
      </Router>
    </Suspense>
  )
}

export default App
