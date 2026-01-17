import { Spin } from 'antd'
import './MainWorkplace.css'
import { useEffect, useState } from 'react'

import { type ScheduleRecord } from './columnsConfig'
import { dataSource } from './dataSource'
import { GroupsService } from '../../data/sources/GroupsService/GroupsService'
import { MoreSettings } from '../MoreSettings/MoreSettings'
import { GroupFound } from '../GroupFound'
import { MainForm } from '../MainForm'
import { LoadingProgressBar } from '../LoadingProgressBar'
import { ScheduleTable } from '../ScheduleTable'

export const MainWorkplace = () => {
  const [groups, setGroups] = useState<string[]>([])
  const [groupsScanned, setGroupsScanned] = useState(0)
  const groupScannedPercent = Math.round((groupsScanned / (groups.length || 1)) * 100)

  const [hideEmptyDaysTypes, setHideEmptyDaysTypes] = useState(false)
  const [hideEmptyRows, setHideEmptyRows] = useState(false)

  const [loadingGroups, setLoadingGroups] = useState(true)
  const [loadingAllGroupsSchedule, setLoadingAllGroupsSchedule] = useState(false)

  const [rawTableData, setRawTableData] = useState<ScheduleRecord[]>(dataSource)

  const { getGroups } = GroupsService

  useEffect(() => {
    const fetchGroups = async () => {
      const groupsData = await getGroups()
      setGroups(groupsData || [])
      setLoadingGroups(false)
    }

    fetchGroups()
  }, [getGroups])

  return (
    <main>
      <Spin spinning={loadingGroups} tip="Получение списка групп...">
        <GroupFound groups={groups} />
        <MainForm
          setGroupsScanned={setGroupsScanned}
          setLoadingAllGroupsSchedule={setLoadingAllGroupsSchedule}
          setRawTableData={setRawTableData}
          loadingGroups={loadingGroups}
          loadingAllGroupsSchedule={loadingAllGroupsSchedule}
          groups={groups}
          dataSource={dataSource}
        />

        {(loadingAllGroupsSchedule || groupScannedPercent == 100) && (
          <MoreSettings
            hideEmptyDaysTypes={hideEmptyDaysTypes}
            setHideEmptyDaysTypes={setHideEmptyDaysTypes}
            hideEmptyRows={hideEmptyRows}
            setHideEmptyRows={setHideEmptyRows}
          />
        )}

        {loadingAllGroupsSchedule && groupScannedPercent < 100 && (
          <LoadingProgressBar groupScannedPercent={groupScannedPercent} />
        )}

        {groupScannedPercent === 100 && (
          <ScheduleTable hideEmptyRows={hideEmptyRows} rawTableData={rawTableData} />
        )}
      </Spin>
    </main>
  )
}
