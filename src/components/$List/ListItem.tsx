import { css, useTheme } from '@emotion/react'
import styled from '@emotion/styled'
import React, { ElementType, PropsWithChildren } from 'react'
import { PC, PP, PR } from '../../types/PolymorphicElementProps'
import { computeHoverColor, readableColor } from '../../utils/color'
import { forwardRefWithGenerics } from '../../utils/ref'
import { cssClickable, cssVariables } from '../../utils/styles'
import { transparentHoverTemplate } from '../../utils/variables'

const { vars, v, styles } = cssVariables(
  {
    ...transparentHoverTemplate,
  },
  'listItem'
)

const paddingMap = {
  none: 'padding: 0;',
  normal: 'padding: 16px 8px;',
  wide: 'padding: 32px 16px;',
}

const ListItemWrapper = styled.li`
  display: list-item;
  width: 100%;
  list-style: none;
  border-bottom: ${({ theme }) => theme.styles.border()};
  &:last-child {
    border-bottom: none;
  }
`

interface ListItemContainerProps {
  clickable: boolean
  disabled?: boolean
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

const ListItemContainer = styled.div<ListItemContainerProps>`
  ${({ theme }) => styles(theme)}
  display: block;
  width: 100%;
  background: ${v.backgroundColor};
  color: ${v.textColor};
  ${({ clickable }) => clickable && whenClickable}
  ${({ padding }) => paddingMap[padding]}
`

export interface ListItemProps extends PropsWithChildren {
  backgroundColor?: string
  hoverColor?: string
  clickable?: boolean
  disabled?: boolean
  padding?: 'none' | 'normal' | 'wide'
}

export const ListItem: PC<'div', ListItemProps> = forwardRefWithGenerics(
  <T extends ElementType>(props: PP<T, ListItemProps>, ref?: PR<T>) => {
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
      <ListItemWrapper>
        <ListItemContainer
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
        </ListItemContainer>
      </ListItemWrapper>
    )
  }
)
