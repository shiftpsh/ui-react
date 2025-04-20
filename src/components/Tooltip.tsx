import { ThemeProvider } from '@emotion/react'
import styled from '@emotion/styled'
import {
  arrow,
  autoUpdate,
  flip,
  FloatingPortal,
  offset,
  safePolygon,
  shift,
  useClick,
  useDismiss,
  useFloating,
  useHover,
  useInteractions,
} from '@floating-ui/react'
import { AnimatePresence, motion } from 'framer-motion'
import { transparentize } from 'polished'
import React, {
  CSSProperties,
  PropsWithChildren,
  ReactNode,
  useMemo,
  useRef,
  useState,
} from 'react'
import { SolvedTheme, solvedThemes } from '../styles'
import { Card, CardProps } from './Card'

const TooltipWrapper = styled.span`
  display: inline;
`

const TooltipContainer = styled(motion(Card))`
  background-color: ${({ theme }) =>
    transparentize(0.1, theme.color.background.card.main)};
  border: ${({ theme }) => theme.styles.border()};
  box-shadow: ${({ theme }) => theme.styles.shadow(undefined, 16)};
  z-index: 30000;
  backdrop-filter: blur(4px);
  font-size: initial;
  font-weight: initial;
`

const Arrow = styled.div`
  position: absolute;
  width: 16px;
  height: 16px;
  border-width: 8px;
  border-style: solid;
  border-color: transparent transparent
    ${({ theme }) => transparentize(0.1, theme.color.background.card.main)}
    transparent;
  z-index: 30000;
  pointer-events: none;
`

const renderSide = {
  top: 'bottom',
  right: 'left',
  bottom: 'top',
  left: 'right',
} as const

type TooltipPlacementBasic = 'top' | 'right' | 'bottom' | 'left'
type TooltipPlacementRelative = 'start' | 'end'

export type TooltipPlacement =
  | `${TooltipPlacementBasic}-${TooltipPlacementRelative}`
  | TooltipPlacementBasic

export type TooltipProps = {
  title?: ReactNode
  theme?: SolvedTheme
  children?: ReactNode
  arrow?: boolean
  open?: boolean
  place?: TooltipPlacement
  interactive?: boolean
  activateOnHover?: boolean
  activateOnClick?: boolean
  noThemeChange?: boolean
  zIndex?: number
  onOpenChange?: (open: boolean) => void
} & (
  | {
      noDefaultStyles: false
    }
  | (CardProps & {
      noDefaultStyles?: true
    })
) &
  PropsWithChildren

const resolveArrowStyles = (
  arrowX: number | undefined | null,
  arrowY: number | undefined | null,
  arrowPosition: 'top' | 'bottom' | 'left' | 'right',
  padding = 16
): CSSProperties => {
  if (arrowPosition === 'bottom') {
    return {
      left: arrowX ?? undefined,
      bottom: -padding,
      transform: `scaleY(-1)`,
    }
  }
  if (arrowPosition === 'top') {
    return {
      left: arrowX ?? undefined,
      top: -padding,
    }
  }
  if (arrowPosition === 'left') {
    return {
      top: arrowY ?? undefined,
      left: -16,
      transform: `rotate(-90deg)`,
    }
  }
  if (arrowPosition === 'right') {
    return {
      top: arrowY ?? undefined,
      right: -16,
      transform: `rotate(90deg)`,
    }
  }
  return {}
}

export const Tooltip: React.FC<TooltipProps> = (props) => {
  const {
    title,
    theme,
    noDefaultStyles: noBackground,
    children,
    arrow: drawArrow = true,
    open,
    place,
    interactive = false,
    activateOnHover = true,
    activateOnClick = false,
    noThemeChange = false,
    zIndex,
    onOpenChange,
    ...cardProps
  } = props
  const [isOpen, setIsOpen] = useState(false)
  const renderTooltip = typeof open === 'boolean' ? open : isOpen

  const arrowRef = useRef(null)

  const handleOpenChange = (open: boolean): void => {
    setIsOpen(open)
    if (onOpenChange) {
      onOpenChange(open)
    }
  }

  const {
    x,
    y,
    refs,
    strategy,
    context,
    placement,
    middlewareData: { arrow: { x: arrowX, y: arrowY } = {} },
  } = useFloating({
    placement: place,
    strategy: 'fixed',
    open: isOpen,
    onOpenChange: handleOpenChange,
    middleware: [
      offset(16),
      shift({ padding: 16 }),
      flip(),
      arrow({ element: arrowRef }),
    ],
    whileElementsMounted: (reference, floating, update) =>
      autoUpdate(reference, floating, update, {
        animationFrame: true,
      }),
  })

  const { getReferenceProps, getFloatingProps } = useInteractions([
    useHover(context, {
      enabled: activateOnHover,
      delay: 200,
      move: true,
      handleClose: safePolygon({
        buffer: 1,
      }),
    }),
    useClick(context, {
      enabled: activateOnClick,
    }),
    useDismiss(context, {
      enabled: activateOnClick,
    }),
  ])

  const RenderComponent = noBackground ? motion.div : TooltipContainer
  const ThemeProviderComponent = useMemo(
    () =>
      noThemeChange || noBackground
        ? React.Fragment
        : ({ children }: { children?: ReactNode }) => (
            // eslint-disable-next-line react/jsx-indent
            <ThemeProvider theme={theme || solvedThemes.dark}>
              {children}
            </ThemeProvider>
          ),
    [noThemeChange, noBackground, theme]
  )

  const arrowPosition =
    renderSide[placement.split('-')[0] as keyof typeof renderSide]

  return (
    <React.Fragment>
      <TooltipWrapper ref={refs.setReference} {...getReferenceProps()}>
        {children}
      </TooltipWrapper>
      <FloatingPortal>
        <ThemeProviderComponent>
          <AnimatePresence>
            {renderTooltip && (
              <React.Fragment>
                <RenderComponent
                  ref={refs.setFloating}
                  {...getFloatingProps({
                    ...(cardProps || {}),
                    style: {
                      ...('style' in cardProps ? cardProps.style || {} : {}),
                      position: strategy,
                      top: y || 0,
                      left: x || 0,
                      pointerEvents: interactive ? 'auto' : 'none',
                      zIndex,
                    },
                  })}
                  transition={{ duration: 0.2, ease: 'easeInOut' }}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                >
                  {title}
                  {drawArrow && (
                    <Arrow
                      ref={arrowRef}
                      style={resolveArrowStyles(arrowX, arrowY, arrowPosition)}
                    />
                  )}
                </RenderComponent>
              </React.Fragment>
            )}
          </AnimatePresence>
        </ThemeProviderComponent>
      </FloatingPortal>
    </React.Fragment>
  )
}
