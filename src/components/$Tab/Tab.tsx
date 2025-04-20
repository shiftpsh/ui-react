import { css, useTheme } from '@emotion/react'
import styled from '@emotion/styled'
import { ellipsis } from 'polished'
import React, { ElementType, PropsWithChildren } from 'react'
import { PC, PP, PR } from '../../types/PolymorphicElementProps'
import { computeHoverColor, readableColor } from '../../utils/color'
import { forwardRefWithGenerics } from '../../utils/ref'
import { cssClickable, cssVariables } from '../../utils/styles'
import { transparentHoverTemplate } from '../../utils/variables'

const { vars, v, styles } = cssVariables(
  {
    ...transparentHoverTemplate,
    accentColor: (theme) => theme.color.background.table.header,
    accentHintColor: (theme) => 'transparent',
  },
  'tab'
)

interface TabContainerProps {
  current: boolean
}

const whenCurrent = css`
  font-weight: bold;
  border-bottom: 2px solid ${v.accentColor};
  &:not([disabled]):hover {
    border-bottom: 2px solid ${v.accentColor};
  }
`

const TabContainer = styled.button<TabContainerProps>`
  ${({ theme }) => styles(theme)}
  ${cssClickable}
  ${ellipsis()}
  flex: 1 0 0;
  display: inline-block;
  min-width: 64px;
  padding: 16px 16px;
  text-decoration: none;
  text-align: center;
  user-select: none;
  border: none;
  border-bottom: 2px solid ${v.accentHintColor};
  transition: background-color 0.3s ease, color 0.3s ease,
    border-color 0.3s ease;
  background: ${v.backgroundColor};
  color: ${v.textColor};
  vertical-align: bottom;
  &:not([disabled]):hover,
  &:not([disabled]):active {
    color: ${v.hoverTextColor};
    background-color: ${v.hoverBackgroundColor};
    border-bottom: 2px solid ${v.accentColor};
  }
  ${({ current }) => current && whenCurrent}
`

export interface TabProps extends PropsWithChildren {
  current?: boolean
  disabled?: boolean
  backgroundColor?: string
  hoverColor?: string
  accentColor?: string
  accentHintColor?: string
}

export const Tab: PC<'a', TabProps> = forwardRefWithGenerics(
  <T extends ElementType>(props: PP<T, TabProps>, ref?: PR<T>) => {
    const solvedTheme = useTheme()

    const {
      current = false,
      backgroundColor,
      disabled = false,
      hoverColor,
      accentColor,
      accentHintColor,
      style,
      as = 'a',
      ...rest
    } = props

    const computedAccentColor =
      accentColor ||
      (backgroundColor && readableColor(backgroundColor, solvedTheme))

    const computedHoverColor =
      hoverColor || (backgroundColor && computeHoverColor(backgroundColor))

    return (
      <TabContainer
        ref={ref}
        as={as}
        role="button"
        tabindex={0}
        disabled={disabled}
        current={current}
        style={{
          [vars.backgroundColor]: backgroundColor,
          [vars.hoverBackgroundColor]: computedHoverColor,
          [vars.textColor]:
            backgroundColor && readableColor(backgroundColor, solvedTheme),
          [vars.hoverTextColor]:
            computedHoverColor &&
            readableColor(computedHoverColor, solvedTheme),
          [vars.accentColor]: computedAccentColor,
          [vars.accentHintColor]: accentHintColor,
          ...style,
        }}
        {...rest}
      />
    )
  }
)
