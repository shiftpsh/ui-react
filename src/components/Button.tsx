import { useTheme } from '@emotion/react'
import styled from '@emotion/styled'
import { transparentize } from 'polished'
import React, { ElementType, PropsWithChildren } from 'react'
import { PC, PP, PR } from '../types/PolymorphicElementProps'
import { computeHoverColor, readableColor } from '../utils/color'
import { forwardRefWithGenerics } from '../utils/ref'
import { cssClickable, cssVariables } from '../utils/styles'
import { cardHoverTemplate } from '../utils/variables'

const { vars, v, styles } = cssVariables(
  {
    ...cardHoverTemplate,
    hoverShadow: (theme) =>
      theme.styles.shadow(
        computeHoverColor(theme.color.background.card.main),
        8
      ),
    activeShadow: (theme) =>
      theme.styles.shadow(
        computeHoverColor(theme.color.background.card.main),
        4
      ),
  },
  'button'
)

const paddingMap = {
  none: 'padding: 0;',
  normal: 'padding: 12px 16px;',
}

interface ButtonContainerProps {
  circle: boolean
  fullWidth: boolean
  padding: 'none' | 'normal'
}

const ButtonContainer = styled.button<ButtonContainerProps>`
  ${({ theme }) => styles(theme)}
  ${cssClickable}
  ${({ fullWidth }) => fullWidth && 'width: 100%;'}
  ${({ padding }) => paddingMap[padding]}
  display: inline-block;
  vertical-align: middle;
  text-align: center;
  background: ${v.backgroundColor};
  color: ${v.textColor};
  transition: background-color 0.3s ease, color 0.3s ease, transform 0.3s ease,
    box-shadow 0.3s ease;
  border-radius: ${({ circle }) => (circle ? '9999px' : '4px')};
  &:not([disabled]):hover,
  &:not([disabled]):active {
    background: ${v.hoverBackgroundColor};
    color: ${v.hoverTextColor};
  }
  &:not([disabled]):hover {
    box-shadow: ${v.hoverShadow};
    transform: translate(0, -4px);
  }
  &:not([disabled]):active {
    box-shadow: ${v.activeShadow};
    transform: translate(0, -2px);
  }
`

export interface ButtonProps extends PropsWithChildren {
  backgroundColor?: string
  hoverColor?: string
  primary?: boolean
  transparent?: boolean
  disabled?: boolean
  circle?: boolean
  fullWidth?: boolean
  padding?: 'none' | 'normal'
}

const useComputedBackgroundColor = (props: ButtonProps): string | undefined => {
  const solvedTheme = useTheme()
  const { backgroundColor, primary, transparent } = props

  if (transparent)
    return transparentize(1, cardHoverTemplate.backgroundColor(solvedTheme))
  if (backgroundColor) return backgroundColor
  if (primary) return solvedTheme.color.solvedAc
  return undefined
}

const useComputedHoverColor = (props: ButtonProps): string | undefined => {
  const solvedTheme = useTheme()
  const { backgroundColor, hoverColor, primary, transparent } = props

  if (hoverColor) return hoverColor
  if (backgroundColor) return computeHoverColor(backgroundColor)
  if (primary) return computeHoverColor(solvedTheme.color.solvedAc)
  if (transparent)
    return computeHoverColor(cardHoverTemplate.backgroundColor(solvedTheme))
  return undefined
}

export const Button: PC<'button', ButtonProps> = forwardRefWithGenerics(
  <T extends ElementType>(props: PP<T, ButtonProps>, ref?: PR<T>) => {
    const solvedTheme = useTheme()

    const {
      disabled = false,
      circle = false,
      fullWidth = false,
      padding = 'normal',
      style,
      children,
      as = 'button',
      ...rest
    } = props

    const computedBackgroundColor = useComputedBackgroundColor(props)
    const computedHoverColor = useComputedHoverColor(props)

    return (
      <ButtonContainer
        as={as}
        role="button"
        tabindex={0}
        ref={ref}
        disabled={disabled}
        circle={circle}
        fullWidth={fullWidth}
        padding={padding}
        style={{
          [vars.backgroundColor]: computedBackgroundColor,
          [vars.hoverBackgroundColor]: computedHoverColor,
          [vars.textColor]:
            computedBackgroundColor &&
            readableColor(computedBackgroundColor, solvedTheme),
          [vars.hoverTextColor]:
            computedHoverColor &&
            readableColor(computedHoverColor, solvedTheme),
          [vars.hoverShadow]:
            computedHoverColor &&
            solvedTheme.styles.shadow(computedHoverColor, 8),
          [vars.activeShadow]:
            computedHoverColor &&
            solvedTheme.styles.shadow(computedHoverColor, 4),
          ...style,
        }}
        {...rest}
      >
        {children}
      </ButtonContainer>
    )
  }
)
