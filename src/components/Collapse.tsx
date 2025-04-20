import styled from '@emotion/styled'
import React, {
  ElementType,
  PropsWithChildren,
  useLayoutEffect,
  useRef,
  useState,
} from 'react'
import { PC, PP, PR } from '../types/PolymorphicElementProps'
import { forwardRefWithGenerics } from '../utils/ref'

interface CollapseContainerProps {
  renderHeight: number | 'auto'
  shown: boolean
}

const CollapseContainer = styled.div<CollapseContainerProps>`
  height: ${({ renderHeight }) =>
    typeof renderHeight === 'number' ? `${renderHeight}px` : renderHeight};
  transform-origin: top;
  opacity: ${({ shown }) => (shown ? 1 : 0)};
  transition: height 0.3s ease, opacity 0.3s ease;
  pointer-events: ${({ shown }) => (shown ? 'all' : 'none')};
  overflow: 'hidden';
`

export interface CollapseProps extends PropsWithChildren {
  shown: boolean
}

export const Collapse: PC<'div', CollapseProps> = forwardRefWithGenerics(
  <T extends ElementType>(props: PP<T, CollapseProps>, ref?: PR<T>) => {
    const { as = 'div', shown, children } = props

    const contentsRef = useRef<HTMLDivElement>(null)
    const [contentHeight, setContentHeight] = useState<number>(0)
    const [renderHeight, setRenderHeight] = useState<number | 'auto'>(0)
    const [mountChild, setMountChild] = useState<boolean>(shown)

    useLayoutEffect(() => {
      if (contentsRef.current === null || !mountChild) return
      setContentHeight(contentsRef.current?.clientHeight ?? 0)
    }, [children, mountChild])

    useLayoutEffect(() => {
      if (shown) setMountChild(true)

      setRenderHeight(shown ? 0 : contentHeight)
      const renderHeightDelay = setTimeout(() => {
        setRenderHeight(shown ? contentHeight : 0)
      }, 30)
      const animationDelay = setTimeout(() => {
        setRenderHeight(shown ? 'auto' : 0)
        if (!shown) setMountChild(false)
      }, 400)
      return () => {
        clearTimeout(renderHeightDelay)
        clearTimeout(animationDelay)
      }
    }, [shown, contentHeight])

    return (
      <CollapseContainer
        as={as}
        ref={ref}
        shown={shown}
        renderHeight={renderHeight}
      >
        {mountChild ? <div ref={contentsRef}>{children}</div> : null}
      </CollapseContainer>
    )
  }
)
