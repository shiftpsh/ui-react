import styled from '@emotion/styled'
import React, { ElementType, PropsWithChildren } from 'react'
import { PC, PP, PR } from '../../types/PolymorphicElementProps'
import { forwardRefWithGenerics } from '../../utils/ref'

const TableBodyContainer = styled.tbody`
  display: table-row-group;
`

export const TableBody: PC<'tbody', PropsWithChildren> = forwardRefWithGenerics(
  <T extends ElementType>(props: PP<T>, ref?: PR<T>) => {
    const { as = 'tbody', ...rest } = props

    return <TableBodyContainer ref={ref} as={as} {...rest} />
  }
)
