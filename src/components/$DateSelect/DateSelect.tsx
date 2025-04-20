import styled from '@emotion/styled'
import React, {
  ElementType,
  PropsWithChildren,
  useEffect,
  useState,
} from 'react'
import { PP, PR } from '../../types/PolymorphicElementProps'
import { forwardRefWithGenerics } from '../../utils/ref'
import { DateSelectContext } from './DateSelectContext'
import { DateSelectMonthView } from './DateSelectMonthView'

export interface DateRange {
  start: string
  end: string
}

export type DateSelectValues =
  | {
      type: 'date'
      value: string
      onChange?: (value: string) => void
    }
  | {
      type: 'date-range'
      value: DateRange
      onChange?: (value: DateRange) => void
    }

export interface DateSelectAnnotation extends DateRange {
  title?: string
  color?: string
}

export type DateSelectProps = DateSelectValues & {
  annotations?: DateSelectAnnotation[]
  maxAnnotationsPerDay?: number
  weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6
  locale?: string
  chunks?: number
} & PropsWithChildren

export type DateSelectMode = 'year' | 'month' | 'date'
export type CursorMode = 'select' | 'selectStart' | 'selectEnd'

export type DateSelectCursor =
  | {
      mode: 'select'
      hover: Date | null
    }
  | {
      mode: 'selectStart'
      hover: Date | null
    }
  | {
      mode: 'selectEnd'
      valueStart: Date
      hover: Date | null
    }

// const toDateString = (date: Date): string => {
//   return date.toISOString().split('T')[0]
// }

// const fromDateString = (date: string): Date => {
//   return new Date(date)
// }

const DateSelectContainer = styled.div`
  user-select: none;
  display: flex;
  gap: 1em;
`

export const DateSelect = forwardRefWithGenerics(
  <T extends ElementType>(props: PP<T, DateSelectProps>, ref?: PR<T>) => {
    const {
      type,
      value,
      onChange,
      annotations = [],
      maxAnnotationsPerDay = annotations.length ? 3 : 0,
      weekStartsOn = 0,
      locale,
      chunks = 1,
      ...rest
    } = props
    // const theme = useTheme()

    const [currentMode, setCurrentMode] = useState<DateSelectMode>('date')
    const [selectState, setSelectState] = useState<DateSelectCursor>({
      mode: type === 'date' ? ('select' as const) : ('selectStart' as const),
      hover: null,
    })
    const [cursorDate, setCursorDate] = useState<Date>(new Date())

    useEffect(() => {
      setSelectState({
        mode: type === 'date' ? ('select' as const) : ('selectStart' as const),
        hover: null,
      })
    }, [type])

    // const selectedYear = selectedDate.getFullYear()
    // const selectedMonth = selectedDate.getMonth()

    return (
      <DateSelectContext.Provider value={props}>
        <DateSelectContainer {...rest} ref={ref}>
          {currentMode === 'date' &&
            new Array(chunks).fill(0).map((_, index) => (
              <DateSelectMonthView
                // eslint-disable-next-line react/no-array-index-key
                key={index}
                offset={index - Math.floor(chunks / 2)}
                cursorDate={cursorDate}
                setCursorDate={setCursorDate}
                selectState={selectState}
                setSelectState={setSelectState}
                setModeToMonth={() => setCurrentMode('month')}
                firstMonth={index === 0}
                lastMonth={index === chunks - 1}
              />
            ))}
        </DateSelectContainer>
      </DateSelectContext.Provider>
    )
  }
)
