import React, { PropsWithChildren } from 'react'
import { Tooltip, TooltipProps } from './Tooltip'

export type DropdownProps = TooltipProps & PropsWithChildren

export const Dropdown: React.FC<TooltipProps> = (props) => {
  const {
    interactive = true,
    activateOnHover = false,
    activateOnClick = true,
    noThemeChange = true,
    ...rest
  } = props

  return (
    <Tooltip
      interactive={interactive}
      activateOnHover={activateOnHover}
      activateOnClick={activateOnClick}
      noThemeChange={noThemeChange}
      {...rest}
    />
  )
}
