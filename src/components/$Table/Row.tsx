import styled from '@emotion/styled'
import React, { ElementType, PropsWithChildren, useContext } from 'react'
import { PC, PP, PR } from '../../types/PolymorphicElementProps'
import { forwardRefWithGenerics } from '../../utils/ref'
import { TableContext } from './TableContext'

interface RowContainerProps {
  header: boolean
}

const RowContainer = styled.tr<RowContainerProps>`
  display: table-row;
  ${({ header }) => header && 'text-align: center; font-weight: 700;'}
`

export interface RowProps extends PropsWithChildren {
  header?: boolean
  padding?: 'none' | 'dense' | 'normal' | 'wide'
  verticalAlign?: 'top' | 'middle' | 'bottom'
}

export const Row: PC<'tr', RowProps> = forwardRefWithGenerics(
  <T extends ElementType>(props: PP<T, RowProps>, ref?: PR<T>) => {
    const tableContext = useContext(TableContext)
    const {
      header = false,
      padding = tableContext.padding,
      verticalAlign = tableContext.verticalAlign,
      as = 'tr',
      ...rest
    } = props

    return (
      <TableContext.Provider
        value={{ ...tableContext, padding, verticalAlign }}
      >
        <RowContainer header={header} ref={ref} as={as} {...rest} />
      </TableContext.Provider>
    )
  }
)
