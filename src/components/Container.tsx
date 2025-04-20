import styled from '@emotion/styled'
import React, { ElementType, PropsWithChildren } from 'react'
import { PC, PP, PR } from '../types/PolymorphicElementProps'
import { forwardRefWithGenerics } from '../utils/ref'
import { cssVariables } from '../utils/styles'

const { vars, v, styles } = cssVariables(
  {
    width: '1200px',
  },
  'container'
)

const paddingMap = {
  none: 'padding: 0;',
  normal: 'padding: 0 16px;',
  wide: 'padding: 0 32px;',
}

interface ContainerContainerProps {
  padding: 'none' | 'normal' | 'wide'
  topBarPadding: boolean
}

const ContainerContainer = styled.nav<ContainerContainerProps>`
  ${({ theme }) => styles(theme)}
  max-width: ${v.width};
  ${({ padding }) => paddingMap[padding]}
  ${({ topBarPadding }) => topBarPadding && 'padding-top: 72px;'}
  margin: 0 auto;
`

export interface ContainerProps extends PropsWithChildren {
  w?: string | number
  padding?: 'none' | 'normal' | 'wide'
  topBarPadding?: boolean
}

export const Container: PC<'div', ContainerProps> = forwardRefWithGenerics(
  <T extends ElementType>(props: PP<T, ContainerProps>, ref?: PR<T>) => {
    const {
      w = '1200px',
      padding = 'normal',
      topBarPadding = false,
      style,
      as = 'div',
      ...rest
    } = props

    return (
      <ContainerContainer
        ref={ref}
        as={as}
        padding={padding}
        topBarPadding={topBarPadding}
        style={{
          [vars.width]: typeof w === 'string' ? w : `${w}px`,
          ...style,
        }}
        {...rest}
      />
    )
  }
)
