import { provider } from 'constants/provider'
import { ethers } from 'ethers'
import { getNFTDetails, getNFTSignedContract } from './GolfClub'
import { getNFTReadContract } from './GolfClub'
import { convertABI, _callback } from './utils'

const MARKETPLACE_CONTRACT_ADDRESS =
  '0xc57fAaADc861626651De1E0fA188DECa0d8c3ab8'
const SOL_MARKETPLACE_ABI = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'uint256',
        name: '_golfClubId',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: '_price',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'address',
        name: '_seller',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'bool',
        name: '_active',
        type: 'bool',
      },
    ],
    name: 'ListingUpdate',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'previousOwner',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'newOwner',
        type: 'address',
      },
    ],
    name: 'OwnershipTransferred',
    type: 'event',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_golfClubId',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: '_price',
        type: 'uint256',
      },
    ],
    name: 'addListing',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_golfClubId',
        type: 'uint256',
      },
    ],
    name: 'cancelListing',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'claimOwnerBalance',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getToken',
    outputs: [
      {
        internalType: 'contract GolfClubNFT',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'golfClubContractAddress',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'isOwner',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    name: 'listingIndexToToken',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    name: 'listings',
    outputs: [
      {
        internalType: 'uint256',
        name: 'price',
        type: 'uint256',
      },
      {
        internalType: 'address',
        name: 'seller',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    name: 'listingsBalance',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'nextListingId',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'owner',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_golfClubId',
        type: 'uint256',
      },
    ],
    name: 'purchase',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'renounceOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_contractAddress',
        type: 'address',
      },
    ],
    name: 'setGolfClubContract',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'newOwner',
        type: 'address',
      },
    ],
    name: 'transferOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
]

const MARKETPLACE_ABI = [
  'event ListingUpdate(uint256 _golfClubId, uint256 _price, address _seller, bool _active)',
  'event OwnershipTransferred(address indexed previousOwner, address indexed newOwner)',
  'function addListing(uint256 _golfClubId, uint256 _price)',
  'function cancelListing(uint256 _golfClubId)',
  'function claimOwnerBalance()',
  'function getToken() view returns (address)',
  'function golfClubContractAddress() view returns (address)',
  'function isOwner() view returns (bool)',
  'function listingIndexToToken(uint256) view returns (uint256)',
  'function listings(uint256) view returns (uint256 price, address seller)',
  'function listingsBalance(address) view returns (uint256)',
  'function nextListingId() view returns (uint256)',
  'function owner() view returns (address)',
  'function purchase(uint256 _golfClubId) payable',
  'function renounceOwnership()',
  'function setGolfClubContract(address _contractAddress)',
  'function transferOwnership(address newOwner)',
]

export function log() {
  console.log(convertABI(SOL_MARKETPLACE_ABI))
}
//log()

export function getSignedContractMarketplace(signer) {
  return new ethers.Contract(
    MARKETPLACE_CONTRACT_ADDRESS,
    MARKETPLACE_ABI,
    signer,
  )
}

function getReadContractMarketplace() {
  return new ethers.Contract(
    MARKETPLACE_CONTRACT_ADDRESS,
    MARKETPLACE_ABI,
    provider,
  )
}

export function getPagination(currentPage, pageLimit) {
  return {
    start: currentPage * pageLimit - pageLimit,
    end: currentPage * pageLimit - 1,
  }
}

export async function getTotalListings() {
  const contract = getReadContractMarketplace()
  const nextListingId = await contract.nextListingId()
  return nextListingId.toNumber()
}

export async function getTotalPages(pageLimit) {
  const total = await getTotalListings()
  return total <= 0 ? 1 : parseInt(total / pageLimit + 1)
}

export async function getListings(currentPage, pageLimit) {
  const signer = provider.getSigner()
  const address = await signer.getAddress()
  const listedTokenIds = []

  const { start, end } = getPagination(currentPage, pageLimit)
  if (address) {
    try {
      const contract = getReadContractMarketplace()

      for (let i = start; i <= end; i++) {
        const bigNumberTokenId = await contract.listingIndexToToken(i)
        const tokenId = bigNumberTokenId.toNumber()
        if (listedTokenIds.indexOf(tokenId) === -1) listedTokenIds.push(tokenId)
      }
    } catch (err) {
      console.log({ err })
    }
  }

  return listedTokenIds
}

export async function getListedTokens(currentPage, pageLimit) {
  const signer = provider.getSigner()
  const address = await signer.getAddress()

  const listedTokenIds = await getListings(currentPage, pageLimit)
  const result = []
  const nftContract = getNFTReadContract()

  await Promise.all(
    listedTokenIds.map(async _golfClubId => {
      const nft = await getNFTDetails(nftContract, _golfClubId)
      if (nft?.isListed) {
        result.push({
          nft,
          isMine: nft.owner === address,
          listing: await getTokenListingData(_golfClubId),
        })
      }
    }),
  )

  return result
}

export async function buyNFT(
  _golfClubId,
  _price,
  { onSend, onSuccess, onError },
) {
  const signer = provider.getSigner()
  const address = await signer.getAddress()
  if (address) {
    try {
      const contract = await getSignedContractMarketplace(signer)
      const sent = await contract.purchase(_golfClubId, {
        value: ethers.utils.parseEther(_price),
      })
      _callback(onSend, { tx: sent })
      await sent.wait(1)
      _callback(onSuccess, { tx: sent })
    } catch (err) {
      _callback(onError, err)
      console.log({ err })
    }
  }
}

export async function sellNFT(
  _golfClubId,
  _price,
  { onSend, onSuccess, onError },
) {
  const signer = provider.getSigner()
  const address = await signer.getAddress()
  if (address) {
    try {
      const contract = await getSignedContractMarketplace(signer)
      const _ethPrice = ethers.utils.parseEther(Number(_price).toString())
      const sent = await contract.addListing(_golfClubId, _ethPrice)
      _callback(onSend, { tx: sent })
      await sent.wait(1)
      _callback(onSuccess, { tx: sent })
    } catch (err) {
      _callback(onError, err)
      console.log({ err })
    }
  }
}

export async function cancelListing(
  _golfClubId,
  { onSend, onSuccess, onError },
) {
  const signer = provider.getSigner()
  const address = await signer.getAddress()
  if (address) {
    try {
      const contract = await getSignedContractMarketplace(signer)
      const sent = await contract.cancelListing(_golfClubId)
      _callback(onSend, { tx: sent })
      await sent.wait(1)
      _callback(onSuccess, { tx: sent })
    } catch (err) {
      _callback(onError, err)
      console.log({ err })
    }
  }
}

export async function isApprovedToSell() {
  const signer = provider.getSigner()
  const address = await signer.getAddress()
  if (address) {
    try {
      const nftContract = getNFTSignedContract(signer)
      const isApproved = await nftContract.isApprovedForAll(
        address,
        MARKETPLACE_CONTRACT_ADDRESS,
      )
      return isApproved
    } catch (err) {
      console.log({ err })
    }
  }

  return false
}

export async function approveMarketplace({ onSend, onSuccess, onError }) {
  const signer = provider.getSigner()
  const address = await signer.getAddress()
  if (address) {
    try {
      const nftContract = getNFTSignedContract(signer)
      const sent = await nftContract.setApprovalForAll(
        MARKETPLACE_CONTRACT_ADDRESS,
        true,
      )
      _callback(onSend, { tx: sent })
      await sent.wait(1)
      _callback(onSuccess, { tx: sent })
    } catch (err) {
      _callback(onError, err)
    }
  }
}

export async function getClaimOwnerBalance() {
  const signer = provider.getSigner()
  const address = await signer.getAddress()
  if (address) {
    try {
      const contract = getSignedContractMarketplace(signer)
      const result = await contract.listingsBalance(address)
      return ethers.utils.formatEther(result)
    } catch (err) {
      console.log({ err }, 'Error getting claim balance. Try again!')
    }
  }
}

export async function claimOwnerBalance({ onSend, onSuccess, onError }) {
  const signer = provider.getSigner()
  const address = await signer.getAddress()
  if (address) {
    try {
      const contract = getSignedContractMarketplace(signer)
      const sent = await contract.claimOwnerBalance()
      _callback(onSend, { tx: sent })
      await sent.wait(1)
      _callback(onSuccess, { tx: sent })
    } catch (err) {
      _callback(onError, err)
    }
  }
}

export async function getTokenListingData(_golfClubId) {
  const contract = getReadContractMarketplace()
  const data = await contract.listings(_golfClubId)

  return { ...data, price: ethers.utils.formatEther(data.price) }
}

export async function listenMarketplace(event) {
  const signer = provider.getSigner()
  const address = await signer.getAddress()
  if (address) {
    console.log('listenMarketplace')
    const contract = getReadContractMarketplace()
    contract.on('ListingUpdate', (_tokenId, _price, _seller, _active) => {
      _callback(event, {
        _tokenId: _tokenId.toNumber(),
        _price: ethers.utils.formatEther(_price),
        _seller,
        _active,
        isMine: address === _seller,
      })
    })
  }
}
