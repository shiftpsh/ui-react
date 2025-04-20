import styled from '@emotion/styled'
import React, { ElementType, PropsWithChildren } from 'react'
import { PC, PP, PR } from '../types/PolymorphicElementProps'
import { forwardRefWithGenerics } from '../utils/ref'
import { cssDisablable } from '../utils/styles'

interface TextFieldContainerProps {
  fullWidth: boolean
  resizable: 'none' | 'both' | 'horizontal' | 'vertical'
}

const TextFieldContainer = styled.input<TextFieldContainerProps>`
  ${cssDisablable}
  font-family: inherit;
  height: auto;
  line-height: normal;
  font-size: 1rem;
  padding: 0.8em 0.5em;
  background: ${({ theme }) => theme.color.background.footer};
  color: ${({ theme }) => theme.color.text.primary.main};
  border: ${({ theme }) => theme.styles.border()};
  border-radius: 8px;
  width: ${({ fullWidth }) => (fullWidth ? '100%' : 'auto')};
  resize: ${({ resizable }) => resizable};
`

export interface TextFieldProps extends PropsWithChildren {
  fullWidth?: boolean
  multiline?: boolean
  disabled?: boolean
  resizable?: 'none' | 'both' | 'horizontal' | 'vertical' | boolean
}

const getResizable = (
  resizable: TextFieldProps['resizable']
): 'none' | 'both' | 'horizontal' | 'vertical' => {
  if (typeof resizable === 'boolean') {
    return resizable ? 'both' : 'none'
  }
  if (!resizable) {
    return 'none'
  }
  return resizable
}

export const TextField: PC<'input', TextFieldProps> = forwardRefWithGenerics(
  <T extends ElementType>(props: PP<T, TextFieldProps>, ref?: PR<T>) => {
    const {
      fullWidth = false,
      multiline = false,
      disabled = false,
      resizable = false,
      // TODO types are wrong when `as` is inferred by variant
      as = multiline ? 'textarea' : 'input',
      ...rest
    } = props

    return (
      <TextFieldContainer
        fullWidth={fullWidth}
        disabled={disabled}
        resizable={getResizable(resizable)}
        ref={ref}
        as={as}
        {...rest}
      />
    )
  }
)
