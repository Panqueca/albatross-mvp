import React, { useEffect, useState } from 'react'
import { Flex } from 'rebass'
import { ButtonPrimary } from 'components/Button'
import { claimRewards, getClaimBalance } from 'contracts/Gameplay'
import useCallbackPopups from 'hooks/useCallbackPopups'
import { GAME_CLAIM_BALANCE } from 'store/application/types'
import { useApplicationState } from 'store/application/state'

const ClaimRewards = ({ refreshCollection }) => {
  const [claimBalance, setClaimBalance] = useState(0)
  const { closePopup } = useApplicationState()
  const { waitingUser, onSendTx, errorPopup, successPopup } =
    useCallbackPopups()

  async function refreshRewards() {
    const resultClaimBalance = await getClaimBalance()
    setClaimBalance(resultClaimBalance)
  }

  useEffect(() => {
    refreshRewards()
  }, [])

  function refreshRewardsAndCollection() {
    closePopup(GAME_CLAIM_BALANCE)
    refreshRewards()
    if (typeof refreshCollection === 'function') refreshCollection()
  }

  function handleClaimRewards() {
    waitingUser(GAME_CLAIM_BALANCE)
    claimRewards({
      onSend: () => onSendTx(GAME_CLAIM_BALANCE),
      onSuccess: () =>
        successPopup(
          GAME_CLAIM_BALANCE,
          <div>
            <h3>Rewards added to your wallet</h3>
            <h4>All the claimed balance where sent to your wallet address.</h4>
          </div>,
          refreshRewardsAndCollection,
        ),
      onError: () =>
        errorPopup(
          GAME_CLAIM_BALANCE,
          'Error trying to claim balance.',
          refreshRewardsAndCollection,
        ),
    })
  }

  return (
    <Flex justifyContent="center" alignItems="center">
      <div>
        <div>
          <b>Rewards: {claimBalance}</b>
        </div>
      </div>
      <ButtonPrimary
        style={{ margin: '0px 15px', padding: '2px 15px', width: 'auto' }}
        disabled={claimBalance <= 0}
        onClick={handleClaimRewards}
      >
        Claim
      </ButtonPrimary>
    </Flex>
  )
}

export default ClaimRewards
