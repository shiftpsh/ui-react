import styled from '@emotion/styled'
import React, { ElementType, PropsWithChildren } from 'react'
import { PC, PP, PR } from '../types/PolymorphicElementProps'
import { forwardRefWithGenerics } from '../utils/ref'

const marginMap = {
  none: '0',
  normal: '1em',
  wide: '2em',
}

interface ParagraphContainerProps {
  margin: 'none' | 'normal' | 'wide'
}

const ParagraphContainer = styled.p<ParagraphContainerProps>`
  margin-block-start: ${({ margin }) => marginMap[margin]};
  margin-block-end: ${({ margin }) => marginMap[margin]};
  margin-inline-start: 0;
  margin-inline-end: 0;
`

export interface ParagraphProps extends PropsWithChildren {
  margin?: 'none' | 'normal' | 'wide'
}

export const Paragraph: PC<'p', ParagraphProps> = forwardRefWithGenerics(
  <T extends ElementType>(props: PP<T, ParagraphProps>, ref?: PR<T>) => {
    const { margin = 'normal', as = 'p', ...rest } = props

    return <ParagraphContainer ref={ref} as={as} margin={margin} {...rest} />
  }
)
