import { createState, useState } from '@hookstate/core'

const accountState = createState({
  isLoading: false,
  logged: false,
  address: null,
  balance: 0,
})

export function useAccountState() {
  const state = useState(accountState)

  return {
    get isLogged() {
      return state.logged.get()
    },
    get isLoading() {
      return state.isLoading.get()
    },
    get address() {
      return state.address.get()
    },
    get balance() {
      return state.balance.get()
    },
    startLoading() {
      return state.isLoading.set(true)
    },
    stopLoading() {
      return state.isLoading.set(false)
    },
    setLogged(isLogged = false) {
      return state.logged.set(isLogged)
    },
    setAddress(newAddress = null) {
      return state.address.set(newAddress)
    },
    setBalance(newBalance = null) {
      return state.balance.set(newBalance)
    },
  }
}
