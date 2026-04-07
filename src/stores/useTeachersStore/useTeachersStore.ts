import localforage from 'localforage'
import { create } from 'zustand'

interface TeachersStore {
  teachers: string[]
  selectedTeacher: string | null
  favoriteTeachers: string[]
  setTeachers: (value: string[]) => void
  setSelectedTeacher: (value: string | null) => void
  setFavoriteTeachers: (value: string[]) => void
  toggleFavoriteTeacher: (teacher: string) => Promise<void>
}

const params = new URLSearchParams(window.location.search)
const paramTeacher = params.get('teacher')

export const useTeachersStore = create<TeachersStore>((set, get) => ({
  teachers: [],
  selectedTeacher: paramTeacher ?? null,
  favoriteTeachers: [],

  setTeachers: (value) => set({ teachers: value }),
  setSelectedTeacher: (value) => set({ selectedTeacher: value }),
  setFavoriteTeachers: (value) => set({ favoriteTeachers: value }),
  toggleFavoriteTeacher: async (teacher) => {
    const favoriteTeachers = get().favoriteTeachers
    const isFavorite = favoriteTeachers.includes(teacher)
    const deleteFromFavorites = favoriteTeachers.filter((value) => value !== teacher)
    const addToFavorites = [...favoriteTeachers, teacher]

    const newList = isFavorite ? deleteFromFavorites : addToFavorites

    set({ favoriteTeachers: newList })

    try {
      const currentCache = (await localforage.getItem('personal_data')) || {}
      await localforage.setItem('personal_data', {
        ...currentCache,
        favoriteTeachers: newList,
      })
    } catch (err) {
      console.error('Ошибка сохранения personal_data в кэше:', err)
    }
  },
}))
