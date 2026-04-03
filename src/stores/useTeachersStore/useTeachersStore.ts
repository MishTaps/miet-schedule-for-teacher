import { create } from 'zustand'

interface TeachersStore {
  teachers: string[]
  selectedTeacher: string | null
  favoriteTeachers: string[]
  setTeachers: (value: string[]) => void
  setSelectedTeacher: (value: string) => void
  setFavoriteTeachers: (value: string[]) => void
}

const params = new URLSearchParams(window.location.search)
const paramTeacher = params.get('teacher')

export const useTeachersStore = create<TeachersStore>((set) => ({
  teachers: [],
  selectedTeacher: paramTeacher ?? null,
  favoriteTeachers: [],

  setTeachers: (value) => set({ teachers: value }),
  setSelectedTeacher: (value) => set({ selectedTeacher: value }),
  setFavoriteTeachers: (value) => set({ favoriteTeachers: value }),
}))
