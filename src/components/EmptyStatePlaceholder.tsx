import styled from '@emotion/styled'
import React, { ElementType, PropsWithChildren } from 'react'
import { PC, PP, PR } from '../types/PolymorphicElementProps'
import { forwardRefWithGenerics } from '../utils/ref'
import { cssCentering } from '../utils/styles'

const paddingMap = {
  none: 'padding: 0;',
  normal: 'padding: 32px 0;',
  wide: 'padding: 64px 0;',
}

interface EmptyStatePlaceholderContainerProps {
  fullHeight?: boolean
  padding?: 'none' | 'normal' | 'wide'
}

const EmptyStatePlaceholderContainer = styled.div<EmptyStatePlaceholderContainerProps>`
  ${cssCentering}
  ${({ fullHeight }) => fullHeight && 'height: 100%;'}
  ${({ padding }) => paddingMap[padding || 'normal']}
  width: 100%;
  color: ${({ theme }) => theme.color.text.secondary.main};
  text-align: center;
`

export interface EmptyStatePlaceholderProps extends PropsWithChildren {
  padding?: 'none' | 'normal' | 'wide'
}

export const EmptyStatePlaceholder: PC<'div', EmptyStatePlaceholderProps> =
  forwardRefWithGenerics(
    <T extends ElementType>(
      props: PP<T, EmptyStatePlaceholderProps>,
      ref?: PR<T>
    ) => {
      const { padding, fullHeight, as = 'div', ...rest } = props

      return (
        <EmptyStatePlaceholderContainer
          as={as}
          ref={ref}
          fullHeight={fullHeight}
          padding={padding}
          {...rest}
        />
      )
    }
  )
