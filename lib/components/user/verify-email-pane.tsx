import { Button } from 'react-bootstrap'
import { connect } from 'react-redux'
import { FormattedMessage, IntlShape, useIntl } from 'react-intl'
import React, { useCallback, useEffect } from 'react'

import * as uiActions from '../../actions/ui'
import * as userActions from '../../actions/user'
import { CREATE_ACCOUNT_TERMS_PATH } from '../../util/constants'

import DeleteUser from './delete-user'

interface Props {
  emailVerified?: boolean
  resendVerificationEmail: (intl: IntlShape) => void
  routeTo: (url: string) => void
}

/**
 * This component contains the prompt for the user to verify their email address.
 * It also contains a button that lets the user finish account setup.
 *
 * (One way to make sure the parent page fetches the latest email verification status
 * is to simply reload the page.)
 */
const VerifyEmailPane = ({
  emailVerified,
  resendVerificationEmail,
  routeTo
}: Props) => {
  const intl = useIntl()

  const handleEmailVerified = useCallback(() => window.location.reload(), [])

  const handleResend = useCallback(() => {
    resendVerificationEmail(intl)
  }, [resendVerificationEmail, intl])

  useEffect(() => {
    if (emailVerified) {
      // If the user got to this screen, it is assumed they just signed up,
      // so once their email is verified, automatically go to the
      // next screen, which is the terms page.
      routeTo(CREATE_ACCOUNT_TERMS_PATH)
    }
  }, [emailVerified, routeTo])

  return (
    <div>
      <p>
        <FormattedMessage id="components.VerifyEmailPane.instructions1" />
      </p>
      <p>
        <FormattedMessage id="components.VerifyEmailPane.instructions2" />
      </p>

      <div style={{ margin: '1.5em 0' }}>
        <Button bsSize="large" bsStyle="primary" onClick={handleEmailVerified}>
          <FormattedMessage id="components.VerifyEmailPane.emailIsVerified" />
        </Button>
      </div>

      <div>
        <Button
          bsStyle="link"
          onClick={handleResend}
          style={{ padding: '0px' }}
        >
          <FormattedMessage id="components.VerifyEmailPane.resendVerification" />
        </Button>
      </div>

      <div style={{ marginTop: '3em' }}>
        <DeleteUser />
      </div>
    </div>
  )
}

// connect to the redux store

const mapDispatchToProps = {
  resendVerificationEmail: userActions.resendVerificationEmail,
  routeTo: uiActions.routeTo
}

export default connect(null, mapDispatchToProps)(VerifyEmailPane)
