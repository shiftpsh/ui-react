import { css, useTheme } from '@emotion/react'
import styled from '@emotion/styled'
import React, { ElementType, PropsWithChildren } from 'react'
import { PC, PP, PR } from '../types/PolymorphicElementProps'
import { computeHoverColor, readableColor } from '../utils/color'
import { forwardRefWithGenerics } from '../utils/ref'
import { cssClickable, cssVariables } from '../utils/styles'
import { cardHoverTemplate } from '../utils/variables'

const { vars, v, styles } = cssVariables(
  {
    ...cardHoverTemplate,
  },
  'card'
)

const paddingMap = {
  none: 'padding: 0;',
  normal: 'padding: 8px;',
  wide: 'padding: 16px;',
}

interface CardContainerProps {
  clickable: boolean
  padding: 'none' | 'normal' | 'wide'
}

const whenClickable = css`
  ${cssClickable}
  transition: background 0.3s ease, color 0.3s ease;
  &:not([disabled]):hover,
  &:not([disabled]):active {
    background: ${v.hoverBackgroundColor};
    color: ${v.hoverTextColor};
  }
`

const CardContainer = styled.div<CardContainerProps>`
  ${({ theme }) => styles(theme)}
  display: block;
  background: ${v.backgroundColor};
  color: ${v.textColor};
  border-radius: 8px;
  ${({ clickable }) => clickable && whenClickable}
  ${({ padding }) => paddingMap[padding]}
`

export interface CardProps extends PropsWithChildren {
  backgroundColor?: string
  hoverColor?: string
  clickable?: boolean
  disabled?: boolean
  padding?: 'none' | 'normal' | 'wide'
}

export const Card: PC<'div', CardProps> = forwardRefWithGenerics(
  <T extends ElementType>(props: PP<T, CardProps>, ref?: PR<T>) => {
    const solvedTheme = useTheme()

    const {
      backgroundColor,
      hoverColor,
      clickable = false,
      disabled = false,
      padding = 'normal',
      style,
      children,
      as = 'div',
      ...rest
    } = props

    const computedHoverColor =
      hoverColor || (backgroundColor && computeHoverColor(backgroundColor))

    return (
      <CardContainer
        ref={ref}
        as={as}
        role={clickable ? 'button' : undefined}
        tabindex={clickable ? 0 : undefined}
        disabled={disabled && clickable}
        clickable={clickable}
        padding={padding}
        style={{
          [vars.backgroundColor]: backgroundColor,
          [vars.hoverBackgroundColor]: computedHoverColor,
          [vars.textColor]:
            backgroundColor && readableColor(backgroundColor, solvedTheme),
          [vars.hoverTextColor]:
            computedHoverColor &&
            readableColor(computedHoverColor, solvedTheme),
          ...style,
        }}
        {...rest}
      >
        {children}
      </CardContainer>
    )
  }
)
