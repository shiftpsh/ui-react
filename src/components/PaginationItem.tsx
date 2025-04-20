import { css, useTheme } from '@emotion/react'
import styled from '@emotion/styled'
import { ellipsis } from 'polished'
import React, { ElementType, PropsWithChildren } from 'react'
import { PC, PP, PR } from '../types/PolymorphicElementProps'
import { computeHoverColor, readableColor } from '../utils/color'
import { forwardRefWithGenerics } from '../utils/ref'
import { cssClickable, cssVariables } from '../utils/styles'
import { transparentHoverTemplate } from '../utils/variables'

const { vars, v, styles } = cssVariables(
  {
    ...transparentHoverTemplate,
    activeBackgroundColor: (theme) =>
      computeHoverColor(theme.color.text.primary.main),
    activeTextColor: (theme) => theme.color.text.primary.inverted,
  },
  'pagination-item'
)

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
  ${({ theme }) => styles(theme)}
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

export interface PaginationItemProps extends PropsWithChildren {
  current?: boolean
  disabled?: boolean
  backgroundColor?: string
  hoverColor?: string
  activeColor?: string
}

export const PaginationItem: PC<'a', PaginationItemProps> =
  forwardRefWithGenerics(
    <T extends ElementType>(props: PP<T, PaginationItemProps>, ref?: PR<T>) => {
      const solvedTheme = useTheme()

      const {
        current = false,
        disabled = false,
        backgroundColor,
        hoverColor,
        activeColor,
        style,
        as = 'a',
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
          role="button"
          tabindex={0}
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
