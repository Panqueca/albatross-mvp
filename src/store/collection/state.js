import { createState, useState } from '@hookstate/core'

const collectionState = createState({
  collection: [],
  isLoading: false,
  neverLoaded: true,
  isApproved: false,
})

export function useCollectionState() {
  const state = useState(collectionState)

  return {
    get collection() {
      return state.collection.get()
    },
    get isLoading() {
      return state.isLoading.get()
    },
    get neverLoaded() {
      return state.neverLoaded.get()
    },
    get isApproved() {
      return state.isApproved.get()
    },
    setCollection(newCollection) {
      return state.collection.set(newCollection)
    },
    startLoading() {
      state.isLoading.set(true)
    },
    stopLoading() {
      state.isLoading.set(false)
      if (state.neverLoaded.get()) state.neverLoaded.set(false)
    },
    setApproved(result) {
      return state.isApproved.set(result)
    },
  }
}
