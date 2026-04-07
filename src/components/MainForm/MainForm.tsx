import { Divider, Empty, Flex, Form, Select } from 'antd'
import styles from './MainForm.module.css'
import { useEffect, useMemo } from 'react'
import { UserOutlined } from '@ant-design/icons'
import type { DefaultOptionType } from 'antd/es/select'
import { useTeachersStore } from '@/stores'
import { FiltrationSettings, VisualSettings } from './settings'
import { TeacherItem } from './TeacherItem'

export const MainForm = () => {
  const teachers = useTeachersStore((state) => state.teachers)
  const selectedTeacher = useTeachersStore((state) => state.selectedTeacher)
  const favoriteTeachers = useTeachersStore((state) => state.favoriteTeachers)
  const setSelectedTeacher = useTeachersStore((state) => state.setSelectedTeacher)

  useEffect(() => {
    if (!selectedTeacher) {
      return
    }

    const url = new URL(window.location.href)
    url.searchParams.set('teacher', selectedTeacher)
    window.history.replaceState({}, '', url)
  }, [selectedTeacher])

  const teacherOptions = useMemo<DefaultOptionType[]>(() => {
    if (favoriteTeachers.length === 0) {
      return teachers.map((t) => ({ label: t, value: t }))
    }

    const favoriteOptions = teachers
      .filter((teacher) => favoriteTeachers.includes(teacher))
      .map((teacher) => ({ label: teacher, value: teacher }))
    const otherOptions = teachers
      .filter((teacher) => !favoriteTeachers.includes(teacher))
      .map((teacher) => ({ label: teacher, value: teacher }))

    return [
      { label: 'Избранные', options: favoriteOptions },
      { label: 'Остальные преподаватели', options: otherOptions },
    ]
  }, [teachers, favoriteTeachers])

  const selectTeacher = (value: string) => {
    setSelectedTeacher(value)
    ;(document.activeElement as HTMLElement)?.blur()
  }

  return (
    <>
      <Divider>Заполните форму:</Divider>
      <Form layout="vertical" className={styles.form}>
        <Form.Item label="Преподаватель:" className={styles.select}>
          <Select
            showSearch
            virtual
            placeholder="Поиск по ФИО..."
            options={teacherOptions}
            onSelect={selectTeacher}
            prefix={<UserOutlined />}
            value={selectedTeacher}
            optionRender={(option) => <TeacherItem teacher={String(option.label)} />}
            notFoundContent={
              <Empty description="Преподаватели не найдены" image={Empty.PRESENTED_IMAGE_SIMPLE} />
            }
          />
        </Form.Item>
        <Flex wrap="wrap" className={styles.settingsBox}>
          <FiltrationSettings />
          <VisualSettings />
        </Flex>
      </Form>
    </>
  )
}
