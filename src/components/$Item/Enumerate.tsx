import styled from '@emotion/styled'
import React, { ElementType, PropsWithChildren, useContext } from 'react'
import { PC, PP, PR } from '../../types/PolymorphicElementProps'
import { forwardRefWithGenerics } from '../../utils/ref'
import { ItemizeContext } from './ItemizeContext'

const marginMap = {
  none: '0',
  normal: '1em',
  wide: '2em',
}

interface EnumerateContainerProps {
  marker: string
  margin: 'none' | 'normal' | 'wide'
}

const EnumerateContainer = styled.ol<EnumerateContainerProps>`
  padding-inline-start: 4ch;
  margin-block-start: ${({ margin }) => marginMap[margin]};
  margin-block-end: ${({ margin }) => marginMap[margin]};
  margin-inline-start: 0;
  margin-inline-end: 0;
  list-style-type: ${({ marker }) => marker};
  & > li::marker {
    color: ${({ theme }) => theme.color.text.secondary.main};
  }
`

export interface EnumerateProps extends PropsWithChildren {
  marker?: string
  margin?: 'none' | 'normal' | 'wide'
}

export const Enumerate: PC<'ol', EnumerateProps> = forwardRefWithGenerics(
  <T extends ElementType>(props: PP<T, EnumerateProps>, ref?: PR<T>) => {
    const itemizeContext = useContext(ItemizeContext)
    const {
      margin = itemizeContext.level === 0 ? 'normal' : 'none',
      marker = 'decimal',
      as = 'ol',
      ...rest
    } = props

    return (
      <ItemizeContext.Provider
        value={{ marker, usesCounter: true, level: itemizeContext.level + 1 }}
      >
        <EnumerateContainer
          margin={margin}
          marker={marker}
          ref={ref}
          as={as}
          {...rest}
        />
      </ItemizeContext.Provider>
    )
  }
)
