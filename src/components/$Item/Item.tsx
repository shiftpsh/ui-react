import styled from '@emotion/styled'
import React, { ElementType, PropsWithChildren, useContext } from 'react'
import { PC, PP, PR } from '../../types/PolymorphicElementProps'
import { forwardRefWithGenerics } from '../../utils/ref'
import { ItemizeContext } from './ItemizeContext'

interface ItemContainerProps {
  marker: string
  usesCounter: boolean
}

const ItemContainer = styled.li<ItemContainerProps>`
  list-style-type: ${({ marker, usesCounter }) =>
    usesCounter ? marker : `'${marker} '`};
  & > li::marker {
    color: ${({ theme }) => theme.color.text.secondary.main};
  }
`

export interface ItemProps extends PropsWithChildren {
  marker?: string
}

export const Item: PC<'li', ItemProps> = forwardRefWithGenerics(
  <T extends ElementType>(props: PP<T, ItemProps>, ref?: PR<T>) => {
    const itemizeContext = useContext(ItemizeContext)
    const { marker = itemizeContext.marker, as = 'li', ...rest } = props

    return (
      <ItemContainer
        ref={ref}
        as={as}
        marker={marker}
        usesCounter={itemizeContext.usesCounter}
        {...rest}
      />
    )
  }
)
