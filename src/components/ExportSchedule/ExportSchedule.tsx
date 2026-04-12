// TODO: Этот файл прям ПОЛНОСТЬЮ нужно рефакторить

import { Button, Card, DatePicker, Divider, Flex, Form, Tour, type TourProps } from 'antd'
import { CloudDownloadOutlined } from '@ant-design/icons'
import styles from './ExportSchedule.module.css'
import { createEvents, type EventAttributes } from 'ics'
import type { ScheduleRecord } from '@/types'
import type { Dayjs } from 'dayjs'
import dayjs from 'dayjs'
import 'dayjs/locale/ru'
import { useRef, useState } from 'react'
import { useTeachersStore } from '@/stores'

interface ExportSchedule {
  tableData: ScheduleRecord[]
}

const WEEKDAY_MAP: Record<number, string> = {
  1: 'MO',
  2: 'TU',
  3: 'WE',
  4: 'TH',
  5: 'FR',
  6: 'SA',
}

const SEMESTER_START = {
  year: 2026,
  month: 2,
  day: 5,
}

type ParsedLesson = {
  name: string
  room: string
  groups: string
}

export const ExportSchedule: React.FC<ExportSchedule> = ({ tableData }) => {
  const selectedTeacher = useTeachersStore((state) => state.selectedTeacher)

  dayjs.locale('ru')
  const [startWeek, setStartWeek] = useState<Dayjs | null>(null)
  const [endWeek, setEndWeek] = useState<Dayjs | null>(null)

  const ref0 = useRef(null)
  const ref1 = useRef(null)
  const ref2 = useRef(null)
  const [semesterStart, setSemesterStart] = useState(SEMESTER_START)
  const [semesterEnd, setSemesterEnd] = useState('20260605T235959Z')

  const [open, setOpen] = useState<boolean>(false)

  const steps: TourProps['steps'] = [
    {
      title: 'Добавление расписания в календарь',
      description: (
        <div>
          <p>
            Вы можете экспортировать расписание в любой календарь: Google Календарь, Яндекс
            Календарь, Outlook и другие.
          </p>
          <p>После импорта занятия появятся в вашем календаре.</p>
        </div>
      ),
      target: () => ref0.current,
    },
    {
      title: 'Выберите период',
      description: (
        <div>
          <p>
            Занятия будут добавлены в календаре только внутри этого периода — за его пределами
            занятия в календаре создаваться не будут.
          </p>
          <p>
            <b>Внимание!</b>
            <br></br>Начальная неделя экспорта будет определяться как <b>Числитель I</b>.
          </p>
        </div>
      ),
      target: () => ref1.current,
    },
    {
      title: 'Скачивание и импорт',
      description: (
        <div>
          <p>
            Нажмите кнопку, чтобы скачать файл <b>.ics</b>. Затем импортируйте его в ваш календарь
            через настройки календаря.
          </p>
          <p>Пример пути настройки: Календари → Настройки → Импорт.</p>
        </div>
      ),
      target: () => ref2.current,
      cover: <img draggable={false} src="/tour-step-2.png" className={styles.image2} />,
    },
  ]

  const parseCellLessons = (raw: string): ParsedLesson[] => {
    if (!raw) return []

    let text = raw.replace(/\r\n/g, '\n').trim()

    const lines = text.split('\n')
    if (
      lines.length >= 2 &&
      /^\d+\s*пара/i.test(lines[0]) &&
      /^\d{1,2}:\d{2}\s*-\s*\d{1,2}:\d{2}$/.test(lines[1])
    ) {
      text = lines.slice(2).join('\n').trim()
    }

    return text
      .split(/\n---\n/)
      .map((block) => block.trim())
      .filter(Boolean)
      .map((block) => {
        const parts = block
          .split('\n')
          .map((l) => l.trim())
          .filter(Boolean)

        if (parts.length < 3) return null

        return {
          groups: parts[0],
          name: parts[1],
          room: parts[2],
        }
      })
      .filter((x): x is ParsedLesson => x !== null)
  }

  const getWeeksCount = () => {
    if (!startWeek || !endWeek) return 0
    return endWeek.startOf('week').diff(startWeek.startOf('week'), 'week') + 1
  }

  const handleDownload = () => {
    const lessons: EventAttributes[] = []

    tableData.forEach((row) => {
      const [, timeLine] = row.lesson.split('\n')
      if (!timeLine) return

      const [timeStart, timeEnd] = timeLine.split(' - ')

      Object.entries(row)
        .filter(([key]) => key.startsWith('day'))
        .forEach(([dayKey, dayValue]) => {
          const dayNumber = Number(dayKey.replace('day', ''))

          Object.entries(dayValue as Record<string, string>).forEach(
            ([weekTypeKey, lessonsInCell]) => {
              if (!lessonsInCell) return

              const weekTypeIndex = Number(weekTypeKey.replace('weekType', ''))
              const weeksCount = getWeeksCount()
              if (weekTypeIndex >= weeksCount) return
              if (Number.isNaN(weekTypeIndex)) return

              const parsedLessons = parseCellLessons(lessonsInCell)

              parsedLessons.forEach(({ name, room, groups }) => {
                lessons.push(
                  createICSLesson(name, dayNumber, timeStart, timeEnd, room, groups, weekTypeIndex),
                )
              })
            },
          )
        })
    })

    const { error, value } = createEvents(lessons)

    if (error || !value) {
      console.error(error)
      return
    }

    const blob = new Blob([value], { type: 'text/calendar;charset=utf-8' })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `Расписание ${selectedTeacher}.ics`)
    document.body.appendChild(link)
    link.click()

    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
  }

  const getFirstLessonDate = (dayNumber: number, weekTypeIndex: number) => {
    const base = dayjs(
      `${semesterStart.year}-${String(semesterStart.month).padStart(2, '0')}-${String(
        semesterStart.day,
      ).padStart(2, '0')}`,
    )

    const offsetDays = weekTypeIndex * 7 + (dayNumber - 1)

    const result = base.add(offsetDays, 'day')

    return {
      year: result.year(),
      month: result.month() + 1,
      day: result.date(),
    }
  }

  const createICSLesson = (
    name: string,
    dayNumber: number,
    start: string,
    end: string,
    room: string,
    groups: string,
    weekTypeIndex: number,
  ): EventAttributes => {
    const [startHour, startMinute] = start.split(':').map(Number)
    const [endHour, endMinute] = end.split(':').map(Number)

    const date = getFirstLessonDate(dayNumber, weekTypeIndex)

    return {
      title: name,
      start: [date.year, date.month, date.day, startHour, startMinute],
      end: [date.year, date.month, date.day, endHour, endMinute],
      startInputType: 'local',
      startOutputType: 'local',
      location: `Ауд. ${room}`,
      description: `Группы: ${groups}`,
      recurrenceRule: [
        'FREQ=WEEKLY',
        'INTERVAL=4',
        `BYDAY=${WEEKDAY_MAP[dayNumber]}`,
        `UNTIL=${semesterEnd}`,
      ].join(';'),
      categories: ['Расписание занятий'],
      calName: 'Расписание занятий',
      status: 'CONFIRMED',
      busyStatus: 'BUSY',
    }
  }

  const onChangeStart = (date: Dayjs | null) => {
    setStartWeek(date)
    if (!date) return

    const startDate = date.startOf('week')
    setSemesterStart({
      year: startDate.year(),
      month: startDate.month() + 1,
      day: startDate.date(),
    })
  }

  const onChangeEnd = (date: Dayjs | null) => {
    setEndWeek(date)
    if (!date) return

    const endDate = date.endOf('week')
    setSemesterEnd(endDate.format('YYYYMMDDTHHmmss[Z]'))
  }

  const disableStartAfterEnd = (current: Dayjs) => {
    if (!endWeek) return false

    return current.startOf('week').isAfter(endWeek.endOf('week'))
  }

  const disableEndBeforeStart = (current: Dayjs) => {
    if (!startWeek) return false

    return current.endOf('week').isBefore(startWeek.startOf('week'))
  }

  const canDownload = startWeek && endWeek

  const generateWeeksList = () => {
    if (!canDownload) return null

    const weeks = []
    let current = startWeek.startOf('week')
    const end = endWeek.startOf('week')

    let weekIndex = 1

    const types = ['Числитель I', 'Числитель II', 'Знаменатель I', 'Знаменатель II']

    while (current.isBefore(end) || current.isSame(end, 'day')) {
      const dateRange = `${current.format('DD.MM')} - ${current.endOf('week').format('DD.MM.YYYY')}`

      const typeLabel = types[(weekIndex - 1) % 4]

      weeks.push(
        <div key={weekIndex} className={styles.weekItem}>
          <p>
            Неделя №{weekIndex}. {typeLabel}:
          </p>
          <p>{dateRange}</p>
        </div>,
      )

      current = current.add(1, 'week')
      weekIndex++
    }

    return weeks
  }

  return (
    <div ref={ref0}>
      <Divider>Экспорт расписания в ваш календарь</Divider>
      <Form layout="vertical" className={styles.form}>
        <Button block className={styles.howUseButton} onClick={() => setOpen(true)}>
          Как пользоваться экспортом?
        </Button>
        <div ref={ref1}>
          <Flex wrap="wrap" gap="middle">
            <Form.Item label="Начальная неделя экспорта:" className={styles.selectWeek}>
              <DatePicker
                format={(value) =>
                  `${value.startOf('week').format('DD.MM')} - ${value.endOf('week').format('DD.MM.YYYY')}`
                }
                className={styles.weekInput}
                picker="week"
                onChange={onChangeStart}
                disabledDate={disableStartAfterEnd}
              ></DatePicker>
            </Form.Item>
            <Form.Item label="Конечная неделя экспорта:" className={styles.selectWeek}>
              <DatePicker
                format={(value) =>
                  `${value.startOf('week').format('DD.MM')} - ${value.endOf('week').format('DD.MM.YYYY')}`
                }
                picker="week"
                className={styles.weekInput}
                onChange={onChangeEnd}
                disabledDate={disableEndBeforeStart}
                required
              ></DatePicker>
            </Form.Item>
          </Flex>
        </div>
        {canDownload && (
          <Card
            size="small"
            title="Информация об экспортируемых неделях"
            className={styles.card}
            styles={{ body: { height: 'calc(100% - 38px)', overflowY: 'auto' } }}
          >
            <div>{generateWeeksList()}</div>
          </Card>
        )}

        <Form.Item>
          <div ref={ref2}>
            <Button
              block
              onClick={handleDownload}
              type="primary"
              disabled={!canDownload}
              icon={<CloudDownloadOutlined />}
            >
              Скачать расписание (.ics)
            </Button>
          </div>
        </Form.Item>
        <Tour open={open} onClose={() => setOpen(false)} steps={steps} />
      </Form>
    </div>
  )
}
