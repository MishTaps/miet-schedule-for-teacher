import { Button, Result, Spin } from 'antd'
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
import { ExportOutlined } from '@ant-design/icons'
import { messages } from './messages'

interface MainWorkplace {
  isOpenedOnFreeServer: boolean
}

export const MainWorkplace: React.FC<MainWorkplace> = ({ isOpenedOnFreeServer }) => {
  const [groups, setGroups] = useState<string[]>([])
  const [groupsScanned, setGroupsScanned] = useState(0)
  const groupScannedPercent = Math.round((groupsScanned / (groups.length || 1)) * 100)

  const [hideEmptyDaysTypes, setHideEmptyDaysTypes] = useState(false)
  const [hideEmptyRows, setHideEmptyRows] = useState(false)

  const [loadingGroups, setLoadingGroups] = useState(true)
  const [isGroupsLoadedWithError, setIsGroupsLoadedWithError] = useState(false)
  const [loadingAllGroupsSchedule, setLoadingAllGroupsSchedule] = useState(false)

  const [rawTableData, setRawTableData] = useState<ScheduleRecord[]>(dataSource)

  const { getGroups } = GroupsService

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const groupsData = await getGroups()
        setGroups(groupsData)
      } catch (error) {
        if (error instanceof Error) {
          setIsGroupsLoadedWithError(true)
        }
      } finally {
        setLoadingGroups(false)
      }
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
          isGroupsLoadedWithError={isGroupsLoadedWithError}
        />

        {isGroupsLoadedWithError && (
          <Result
            status="500"
            title="Ошибка сервера"
            subTitle={isOpenedOnFreeServer ? messages.onlineServer : messages.localServer}
            extra={
              isOpenedOnFreeServer ? (
                <Button
                  type="primary"
                  href="https://github.com/MishTaps/miet-schedule-for-teacher/tree/main?tab=readme-ov-file#%D0%B7%D0%B0%D0%BF%D1%83%D1%81%D0%BA-%D0%BF%D1%80%D0%BE%D0%B3%D1%80%D0%B0%D0%BC%D0%BC%D1%8B-%D0%BB%D0%BE%D0%BA%D0%B0%D0%BB%D1%8C%D0%BD%D0%BE"
                  target="_blank"
                >
                  Узнать, как развернуть локально
                  <ExportOutlined />
                </Button>
              ) : null
            }
          />
        )}

        {(loadingAllGroupsSchedule || groupScannedPercent == 100) && (
          <MoreSettings
            hideEmptyDaysTypes={hideEmptyDaysTypes}
            setHideEmptyDaysTypes={setHideEmptyDaysTypes}
            hideEmptyRows={hideEmptyRows}
            setHideEmptyRows={setHideEmptyRows}
          />
        )}

        {loadingAllGroupsSchedule && groupScannedPercent < 100 && (
          <LoadingProgressBar
            groupScannedPercent={groupScannedPercent}
            isOpenedOnFreeServer={isOpenedOnFreeServer}
          />
        )}

        {groupScannedPercent === 100 && (
          <ScheduleTable hideEmptyRows={hideEmptyRows} rawTableData={rawTableData} />
        )}
      </Spin>
    </main>
  )
}
