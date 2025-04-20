import styled from '@emotion/styled'
import React, { ElementType, PropsWithChildren, useContext } from 'react'
import { PC, PP, PR } from '../../types/PolymorphicElementProps'
import { forwardRefWithGenerics } from '../../utils/ref'
import { TableContext } from './TableContext'
import { TableRowGroupContext } from './TableRowGroupContext'

export interface TableHeadContainerProps {
  sticky: boolean | number | string
}

const getStickyValue = (sticky: boolean | number | string): string => {
  if (typeof sticky === 'number') {
    return `${sticky}px`
  }
  if (typeof sticky === 'string') {
    return sticky
  }
  return '0'
}

const TableHeadContainer = styled.thead<TableHeadContainerProps>`
  display: table-header-group;
  ${({ sticky }) =>
    (typeof sticky !== 'boolean' || sticky === true) &&
    `position: sticky; top: ${getStickyValue(sticky)};`}
`

export interface TableHeadProps extends PropsWithChildren {
  sticky?: boolean | number | string
  verticalAlign?: 'top' | 'middle' | 'bottom'
}

export const TableHead: PC<'thead', TableHeadProps> = forwardRefWithGenerics(
  <T extends ElementType>(props: PP<T, TableHeadProps>, ref?: PR<T>) => {
    const tableContext = useContext(TableContext)
    const {
      sticky = tableContext.sticky,
      verticalAlign = tableContext.verticalAlign,
      as = 'thead',
      ...rest
    } = props

    return (
      <TableRowGroupContext.Provider value={{ header: true, verticalAlign }}>
        <TableHeadContainer sticky={sticky} ref={ref} as={as} {...rest} />
      </TableRowGroupContext.Provider>
    )
  }
)
