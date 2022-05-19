import { FormattedList, FormattedTime, IntlShape } from 'react-intl'
import { Itinerary, Leg } from '@opentripplanner/types'
import coreUtils from '@opentripplanner/core-utils'
import React from 'react'

import { firstTransitLegIsRealtime } from '../../../util/viewer'

export const departureTimes = (
  itinerary: Itinerary & {
    allStartTimes: { realtime: boolean; time: number }[]
  }
): JSX.Element => {
  if (!itinerary.allStartTimes) {
    return (
      <span
        className={
          firstTransitLegIsRealtime(itinerary) ? 'realtime first' : 'first'
        }
      >
        <FormattedTime value={itinerary.startTime} />
      </span>
    )
  }
  const allStartTimes = itinerary.allStartTimes.sort((a, b) => a.time - b.time)
  return (
    <FormattedList
      type="conjunction"
      value={allStartTimes.map((time, index) => (
        <span
          className={`${time.realtime ? 'realtime' : ''} ${
            index === 0 ? 'first' : ''
          }`}
          key={index}
        >
          <FormattedTime key={time.time} value={time.time} />
        </span>
      ))}
    />
  )
}

export const getFirstTransitLegStop = (
  itinerary: Itinerary
): string | undefined =>
  itinerary.legs?.find((leg: Leg) => leg?.from?.vertexType === 'TRANSIT')?.from
    ?.name

export const getFlexAttirbutes = (
  itinerary: Itinerary
): {
  isCallAhead: boolean
  isContinuousDropoff: boolean
  isFlexItinerary: boolean
  phone: string
} => {
  const isCallAhead = itinerary.legs?.some(
    coreUtils.itinerary.isReservationRequired
  )

  let phone = itinerary.legs
    .map((leg: Leg) => leg?.agencyName)
    .filter((name: string | undefined) => !!name)[0]

  if (isCallAhead) {
    // Picking 0 ensures that if multiple flex legs with
    // different phone numbers, the first leg is prioritized
    phone = itinerary.legs
      .map((leg: Leg) => leg.pickupBookingInfo?.contactInfo?.phoneNumber)
      .filter((number: string | undefined) => !!number)[0]
  }

  return {
    isCallAhead,
    isContinuousDropoff: itinerary.legs?.some(
      coreUtils.itinerary.isContinuousDropoff
    ),
    isFlexItinerary: itinerary.legs?.some(coreUtils.itinerary.isFlex),
    phone: phone || ''
  }
}

export const removeInsignifigantWalkLegs = (leg: Leg): boolean =>
  // Return true only for non walk-legs or walking legs over 400 meters
  leg.mode !== 'WALK' || leg.distance > 400

/**
 * Generate text for all routes used in an itinerary.
 * TODO: include all alternate routes inside alternateRoutes as well!
 */
export const getItineraryRoutes = (
  itinerary: Itinerary,
  intl: IntlShape
): React.ReactNode => {
  return intl.formatList(
    itinerary.legs
      .map((leg: Leg) => {
        return leg.routeShortName
      })
      .filter((name) => !!name)
  )
}
