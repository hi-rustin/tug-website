import React, { useCallback, useState } from 'react';

import * as Styled from './verifyCodeInput.styled';
import * as constants from './verifyCodeInput.constant';
import CountDown from '../countDown';

const VerifyCodeSuffix = ({
  state,
  disabled,
  sendVerifyCodeBtnText,
  onClickSendButton,
  countDownTotal,
  countDownFormatter,
  onCountDownFinished,
}) => {
  switch (state) {
    case constants.STATE_LIMIT:
      return (
        <Styled.SendEmailButton type="link" disabled size="small">
          <CountDown total={countDownTotal} onFinished={onCountDownFinished} formatter={countDownFormatter} />
        </Styled.SendEmailButton>
      );
    default:
      return (
        <Styled.SendEmailButton
          disabled={disabled}
          loading={state === constants.STATE_SENDING}
          type="link"
          onClick={onClickSendButton}
          size="small"
        >
          {sendVerifyCodeBtnText}
        </Styled.SendEmailButton>
      );
  }
};

const withVerifyCode = (Input) => {
  return ({
    sendVerifyCode,
    sendVerifyCodeBtnText,
    limitSeconds,
    countDownFormatter,
    buttonDisabled = false,
    ...props
  }) => {
    const [state, setState] = useState(constants.STATE_NORMAL);
    const onCountDownFinished = useCallback(() => setState(constants.STATE_NORMAL), []);

    const onClickSendButton = () => {
      if (state) {
        return;
      }
      const prevState = state;
      setState(constants.STATE_SENDING);
      sendVerifyCode()
        .then(() => {
          setState(constants.STATE_LIMIT);
        })
        .catch(() => {
          setState(prevState);
        });
    };

    const suffixProps = {
      state,
      disabled: buttonDisabled || props.disabled,
      sendVerifyCodeBtnText,
      onClickSendButton,
      countDownTotal: limitSeconds,
      onCountDownFinished,
      countDownFormatter,
    };

    return <Input {...props} suffix={<VerifyCodeSuffix {...suffixProps} />} />;
  };
};

export default withVerifyCode;
