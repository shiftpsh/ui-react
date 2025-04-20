import { css } from '@emotion/react'
import styled from '@emotion/styled'
import React, { ElementType, PropsWithChildren, useContext } from 'react'
import { PC, PP, PR } from '../../types/PolymorphicElementProps'
import { forwardRefWithGenerics } from '../../utils/ref'
import { TableContext } from './TableContext'
import { TableRowGroupContext } from './TableRowGroupContext'

const paddingMap = {
  none: 'padding: 0;',
  dense: 'padding: 8px;',
  normal: 'padding: 16px;',
  wide: 'padding: 32px;',
}

interface CellContainerProps {
  padding: 'none' | 'dense' | 'normal' | 'wide'
  verticalAlign: 'top' | 'middle' | 'bottom'
  numeric: boolean
  header: boolean
}

const whenHeader = css`
  text-align: center;
  font-weight: 700;
`

const CellContainer = styled.td<CellContainerProps>`
  display: table-cell;
  border-bottom: ${({ theme }) => theme.styles.border()};
  ${({ padding }) => paddingMap[padding]}
  ${({ verticalAlign }) => `vertical-align: ${verticalAlign};`}
  ${({ numeric }) =>
    numeric && "text-align: right; font-feature-settings: 'tnum';"}
  ${({ header }) => header && whenHeader}
`

export interface CellProps extends PropsWithChildren {
  padding?: 'none' | 'dense' | 'normal' | 'wide'
  verticalAlign?: 'top' | 'middle' | 'bottom'
  header?: boolean
  numeric?: boolean
}

export const Cell: PC<'td', CellProps> = forwardRefWithGenerics(
  <T extends ElementType>(props: PP<T, CellProps>, ref?: PR<T>) => {
    const tableContext = useContext(TableContext)
    const tableRowGroupContext = useContext(TableRowGroupContext)
    const {
      padding = tableContext.padding,
      verticalAlign = tableRowGroupContext.verticalAlign,
      header = tableRowGroupContext.header,
      as,
      numeric = false,
      ...rest
    } = props

    const calculatedAs = as || (header ? 'th' : 'td')

    return (
      <CellContainer
        padding={padding}
        verticalAlign={verticalAlign}
        numeric={numeric}
        header={header}
        ref={ref}
        as={calculatedAs}
        {...rest}
      />
    )
  }
)
