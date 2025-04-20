import styled from '@emotion/styled'
import React, { ElementType, PropsWithChildren } from 'react'
import { PC, PP, PR } from '../../types/PolymorphicElementProps'
import { forwardRefWithGenerics } from '../../utils/ref'

interface TabsContainerProps {
  fullWidth: boolean
  multiline: boolean
}

const TabsContainer = styled.nav<TabsContainerProps>`
  overflow-x: auto;
  display: ${({ fullWidth }) => (fullWidth ? 'flex' : 'block')};
  white-space: ${({ multiline }) => (multiline ? 'nowrap' : 'normal')};
  flex-wrap: ${({ multiline }) => (multiline ? 'wrap' : 'nowrap')};
`

export interface TabsProps extends PropsWithChildren {
  fullWidth?: boolean
  multiline?: boolean
}

export const Tabs: PC<'nav', TabsProps> = forwardRefWithGenerics(
  <T extends ElementType>(props: PP<T, TabsProps>, ref?: PR<T>) => {
    const { fullWidth = false, multiline = false, as = 'nav', ...rest } = props
    return (
      <TabsContainer
        ref={ref}
        as={as}
        fullWidth={fullWidth}
        multiline={multiline}
        {...rest}
      />
    )
  }
)
