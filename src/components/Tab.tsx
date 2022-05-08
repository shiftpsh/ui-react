import { darken, ellipsis, transparentize } from 'polished'
import React from 'react'
import styled, { css, useTheme } from 'styled-components'
import { computeHoverColor, readableColor } from '../utils/color'
import { cssClickable, cssVariables } from '../utils/styles'

const [vars, v] = cssVariables(
  [
    'backgroundColor',
    'hoverBackgroundColor',
    'textColor',
    'hoverTextColor',
    'accentColor',
  ],
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
  border-bottom: 2px solid transparent;
  transition: background-color 0.3s ease, color 0.3s ease,
    border-color 0.3s ease;
  background: ${v.backgroundColor};
  color: ${v.textColor};
  &:not([disabled]):hover,
  &:not([disabled]):active {
    color: ${v.hoverTextColor};
    background-color: ${v.hoverBackgroundColor};
    border-bottom: 2px solid ${v.accentColor};
  }
  ${({ current }) => current && whenCurrent}
`

export interface TabProps extends React.HTMLAttributes<HTMLButtonElement> {
  current?: boolean
  disabled?: boolean
  backgroundColor?: string
  hoverColor?: string
  accentColor?: string
}

export const Tab: React.FC<TabProps> = (props) => {
  const solvedTheme = useTheme()

  const {
    current = false,
    backgroundColor,
    disabled = false,
    hoverColor,
    accentColor,
    style,
    ...rest
  } = props

  const computedBackgroundColor =
    backgroundColor || transparentize(1, solvedTheme.color.background.card.main)

  const computedAccentColor =
    accentColor ||
    readableColor(darken(0.2, computedBackgroundColor), solvedTheme)

  const computedHoverColor = backgroundColor
    ? computeHoverColor(computedBackgroundColor, hoverColor)
    : hoverColor || solvedTheme.color.background.card.main

  return (
    <TabContainer
      disabled={disabled}
      current={current}
      style={{
        [vars.backgroundColor]: computedBackgroundColor,
        [vars.hoverBackgroundColor]: computedHoverColor,
        [vars.textColor]: readableColor(
          darken(0.2, computedBackgroundColor),
          solvedTheme
        ),
        [vars.hoverTextColor]: readableColor(
          darken(0.2, computedHoverColor),
          solvedTheme
        ),
        [vars.accentColor]: computedAccentColor,
        ...style,
      }}
      {...rest}
    />
  )
}
