import { ellipsis } from 'polished'
import React, { ElementType } from 'react'
import styled, { css, useTheme } from 'styled-components'
import {
  PolymorphicProps,
  PolymorphicRef
} from '../types/PolymorphicElementProps'
import { computeHoverColor, readableColor } from '../utils/color'
import { cssClickable, cssVariables } from '../utils/styles'
import { transparentHoverTemplate } from '../utils/variables'

export const paginationItemVariables = cssVariables(
  {
    ...transparentHoverTemplate,
    activeBackgroundColor: (theme) =>
      computeHoverColor(theme.color.text.primary.main),
    activeTextColor: (theme) => theme.color.text.primary.inverted,
  },
  'pagination-item'
)

const { vars, v } = paginationItemVariables

interface PaginationItemContainerProps {
  current: boolean
}

const whenCurrent = css`
  font-weight: bold;
  background: ${v.activeBackgroundColor};
  color: ${v.activeTextColor};
  &:not([disabled]):hover,
  &:not([disabled]):active {
    background: ${v.activeBackgroundColor};
    color: ${v.activeTextColor};
  }
`

const PaginationItemContainer = styled.button<PaginationItemContainerProps>`
  ${ellipsis()}
  ${cssClickable}
  flex: 1 0 0;
  display: inline-block;
  transition: background-color 0.2s;
  min-width: 64px;
  padding: 16px 8px;
  text-decoration: none;
  text-align: center;
  background: ${v.backgroundColor};
  color: ${v.textColor};
  &:not([disabled]):hover,
  &:not([disabled]):active {
    background: ${v.hoverBackgroundColor};
    color: ${v.hoverTextColor};
  }
  ${({ current }) => current && whenCurrent}
`

export type PaginationItemProps<T extends ElementType = 'button'> = {
  current?: boolean
  disabled?: boolean
  backgroundColor?: string
  hoverColor?: string
  activeColor?: string
} & PolymorphicProps<T>

export const PaginationItem = React.forwardRef(
  <T extends ElementType>(
    props: PaginationItemProps<T>,
    ref?: PolymorphicRef<T>
  ): JSX.Element => {
    const solvedTheme = useTheme()

    const {
      current = false,
      disabled = false,
      backgroundColor,
      hoverColor,
      activeColor,
      style,
      as = 'button',
      ...rest
    } = props

    const computedHoverColor =
      hoverColor || (backgroundColor && computeHoverColor(backgroundColor))

    const computedActiveColor =
      activeColor || (backgroundColor && computeHoverColor(backgroundColor))

    return (
      <PaginationItemContainer
        ref={ref}
        as={as}
        current={current}
        disabled={disabled}
        style={{
          [vars.backgroundColor]: backgroundColor,
          [vars.hoverBackgroundColor]: computedHoverColor,
          [vars.activeBackgroundColor]: computedActiveColor,
          [vars.textColor]:
            backgroundColor && readableColor(backgroundColor, solvedTheme),
          [vars.hoverTextColor]:
            computedHoverColor &&
            readableColor(computedHoverColor, solvedTheme),
          [vars.activeTextColor]:
            computedActiveColor &&
            readableColor(computedActiveColor, solvedTheme),
          ...style,
        }}
        {...rest}
      />
    )
  }
)
