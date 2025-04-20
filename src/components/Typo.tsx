import { css } from '@emotion/react'
import styled from '@emotion/styled'
import { ellipsis } from 'polished'
import React, { ElementType, PropsWithChildren } from 'react'
import { SolvedTheme, solvedThemes } from '../styles'
import { PC, PP, PR } from '../types/PolymorphicElementProps'
import { forwardRefWithGenerics } from '../utils/ref'

const variants = (theme: SolvedTheme) =>
  ({
    default: css``,
    description: css`
      color: ${theme.color.text.secondary.main};
    `,
    error: css`
      color: ${theme.color.status.error};
    `,
    info: css`
      color: ${theme.color.status.info};
    `,
    progress: css`
      color: ${theme.color.status.progress};
    `,
    success: css`
      color: ${theme.color.status.success};
    `,
    warn: css`
      color: ${theme.color.status.warn};
    `,
    h1: css`
      display: block;
      word-break: keep-all;
      font-weight: 800;
      font-size: 2em;
      letter-spacing: -0.04ch;
      margin-block-start: 0.67em;
      margin-block-end: 0.67em;
      margin-inline-start: 0px;
      margin-inline-end: 0px;
    `,
    h2: css`
      display: block;
      word-break: keep-all;
      font-weight: 800;
      font-size: 1.5em;
      letter-spacing: -0.02ch;
      margin-block-start: 0.83em;
      margin-block-end: 0.83em;
      margin-inline-start: 0px;
      margin-inline-end: 0px;
    `,
    h3: css`
      display: block;
      word-break: keep-all;
      font-weight: 800;
      font-size: 1.2em;
      margin-block-start: 1em;
      margin-block-end: 1em;
      margin-inline-start: 0px;
      margin-inline-end: 0px;
    `,
    h4: css`
      display: block;
      font-weight: 800;
      font-size: 1em;
      letter-spacing: 0.02ch;
      margin-block-start: 1em;
      margin-block-end: 1em;
      margin-inline-start: 0px;
      margin-inline-end: 0px;
    `,
    h5: css`
      display: block;
      font-weight: 700;
      font-size: 1em;
      letter-spacing: 0.02ch;
      margin-block-start: 1em;
      margin-block-end: 1em;
      margin-inline-start: 0px;
      margin-inline-end: 0px;
    `,
    h6: css`
      display: block;
      font-weight: 600;
      font-size: 1em;
      letter-spacing: 0.02ch;
      margin-block-start: 1em;
      margin-block-end: 1em;
      margin-inline-start: 0px;
      margin-inline-end: 0px;
    `,
    small: css`
      font-size: 75%;
    `,
    smaller: css`
      font-size: 65%;
    `,
    tabular: css`
      font-feature-settings: 'tnum';
    `,
    readable: css`
      font-feature-settings: 'ss06', 'zero';
    `,
    'no-ligatures': css`
      font-variant-ligatures: none;
    `,
    'no-margin': css`
      margin: 0;
    `,
    ellipsis: css`
      ${ellipsis()}
    `,
  } as const)

const variantKeys = Object.keys(variants(solvedThemes.light))

type VariantsObject = ReturnType<typeof variants>
type OptionalVariables = {
  [key in keyof VariantsObject]: boolean
}
export type TypoVariant = keyof VariantsObject

const asMap: Partial<Record<TypoVariant, ElementType>> = {
  h1: 'h1',
  h2: 'h2',
  h3: 'h3',
  h4: 'h4',
  h5: 'h5',
  h6: 'h6',
  small: 'small',
  smaller: 'small',
} as const

interface TypoContainerProps {
  variant: TypoVariant[]
}

const TypoContainer = styled.span<TypoContainerProps>`
  ${({ theme, variant }) => variant.map((v) => variants(theme)[v])}
`

export type TypoProps = {
  variant?: TypoVariant | TypoVariant[]
} & Partial<OptionalVariables> &
  PropsWithChildren

const firstVariant = (variant?: TypoVariant[]): TypoVariant | undefined => {
  if (typeof variant === 'string') return variant
  if (Array.isArray(variant) && variant.length > 0) return variant[0]
  return undefined
}

export const Typo: PC<'span', TypoProps> = forwardRefWithGenerics(
  <T extends ElementType>(props: PP<T, TypoProps>, ref?: PR<T>) => {
    const { variant = [], as, ...rest } = props

    const calculatedVariants = [
      ...(typeof variant === 'string' ? [variant] : variant),
      ...Object.entries(rest)
        .filter(
          ([k, v]) => variantKeys.includes(k) && typeof v === 'boolean' && v
        )
        .map(([k]) => k),
    ] as TypoVariant[]

    // TODO types are wrong when `as` is inferred by variant
    const calculatedAs =
      as || asMap[firstVariant(calculatedVariants) ?? 'default'] || 'span'

    const filteredRest = Object.fromEntries(
      Object.entries(rest).filter(([k]) => !variantKeys.includes(k))
    )

    return (
      <TypoContainer
        ref={ref}
        as={calculatedAs}
        variant={calculatedVariants}
        {...filteredRest}
      />
    )
  }
)
