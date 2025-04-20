import styled from '@emotion/styled'
import React, { ElementType, PropsWithChildren } from 'react'
import { PC, PP, PR } from '../../types/PolymorphicElementProps'
import { forwardRefWithGenerics } from '../../utils/ref'

const TableContainerContainer = styled.div`
  overflow-x: auto;
`

export const TableContainer: PC<'div', PropsWithChildren> =
  forwardRefWithGenerics(<T extends ElementType>(props: PP<T>, ref?: PR<T>) => {
    const { as = 'div', ...rest } = props

    return <TableContainerContainer ref={ref} as={as} {...rest} />
  })
