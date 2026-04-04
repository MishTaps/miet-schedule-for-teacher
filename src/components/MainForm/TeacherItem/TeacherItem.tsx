import { useTeachersStore } from '@/stores'
import { Space } from 'antd'
import { HeartFilled, HeartOutlined } from '@ant-design/icons'
import styles from './TeacherItem.module.css'

export const TeacherItem = ({ teacher }: { teacher: string }) => {
  return (
    <Space className={styles.teacherItem}>
      {teacher}
      <FavoriteButton teacher={teacher} />
    </Space>
  )
}

const FavoriteButton = ({ teacher }: { teacher: string }) => {
  const favoriteTeachers = useTeachersStore((state) => state.favoriteTeachers)
  const toggleFavoriteTeacher = useTeachersStore((s) => s.toggleFavoriteTeacher)

  const handleToggleFavorite = async (e: React.MouseEvent<HTMLSpanElement>, teacher: string) => {
    e.stopPropagation()
    toggleFavoriteTeacher(teacher)
  }

  return (
    <span role="button" onClick={(e) => handleToggleFavorite(e, teacher)}>
      {favoriteTeachers.includes(teacher) ? (
        <HeartFilled className={styles.favorite} />
      ) : (
        <HeartOutlined />
      )}
    </span>
  )
}
