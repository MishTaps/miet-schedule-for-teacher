export const en = {
  header: "Teachers' schedule",
  loading: 'Loading...',
  cashed: {
    button: 'Load again',
    day: 'The schedule was uploaded on {{formattedDate}}',
    week: 'The schedule was uploaded more than a day ago: {{formattedDate}}',
    month: 'The schedule was uploaded more than a week ago: {{formattedDate}}',
    halfOfYear: 'The schedule was uploaded more than a month ago: {{formattedDate}}',
  },
  export: {
    header: 'Exporting a schedule to your calendar',
    help: {
      button: 'How to use the export feature?',
      step1: {
        title: 'Exporting a schedule to your calendar',
        description: {
          p1: 'You can export the schedule to any calendar: Google Calendar, Yandex Calendar, Outlook and others.',
          p2: 'After importing, the classes will appear in your calendar.',
        },
      },
      step2: {
        title: 'Select a period',
        description: {
          p1: 'Classes will be added to the calendar only within this period — outside of it, classes will not be created in the calendar.',
          p2: '<bold>Attention!</bold><br />The starting week of the export will be determined as <bold>Odd I (Chislitel I)</bold>',
        },
      },
      step3: {
        title: 'Download and import',
        description: {
          p1: 'Click the button to download the <bold>.ics</bold> file. Then import it into your calendar through the calendar settings.',
          p2: 'Example of the settings path: Calendars → Settings → Import.',
        },
      },
    },
    form: {
      start: 'Initial export week:',
      end: 'Final export week:',
    },
    cardTitle: 'Information about the exported weeks',
    download: 'Download schedule (.ics)',
  },
  footer: {
    info: 'This is <bold>not the official</bold> website of the university administration, but just a small project for students and teachers to expand the functionality of viewing the schedule.',
    button: {
      github: 'GitHub project',
      telegram: 'Feedback',
      downloadPWA: {
        tooltip:
          'The application is not available for installation through your browser or the application is already installed',
        text: 'Download the application (PWA)',
      },
    },
  },
  getSchedule: {
    header: 'Load data from the server',
    button: 'Load schedule',
  },
  loadGroupsAlert: {
    title:
      "Failed to load schedule for {{errorScannedGroupsCount}} groups. The teacher's schedule may be incomplete.",
    button: 'Try again',
  },
  mainForm: {
    header: 'Fill in the form:',
    teacher: {
      label: 'Teacher:',
      placeholder: 'Search by name...',
      empty: 'Teachers not found',
    },
    filtration: {
      header: 'Filtration',
      day: {
        label: 'Day of the week:',
        tooltip: 'Today is Sunday, there are no classes today',
        today: 'Today',
      },
      week: {
        label: 'Week type:',
      },
    },
    visual: {
      header: 'Display Settings',
      sort: {
        label: 'Sort by:',
        tooltip: 'Sorting is available only when filters are disabled',
        sortType: {
          day: 'Days of the week',
          week: 'Week types',
        },
      },
      noColumns: 'Hide columns without classes',
      noRows: 'Hide rows without classes',
      noTime: 'Hide the «Class Time» column',
    },
  },
  days: {
    day1: {
      longName: 'Monday',
      shortName: 'Mon',
    },
    day2: {
      longName: 'Tuesday',
      shortName: 'Tue',
    },
    day3: {
      longName: 'Wednesday',
      shortName: 'Wed',
    },
    day4: {
      longName: 'Thursday',
      shortName: 'Thu',
    },
    day5: {
      longName: 'Friday',
      shortName: 'Fri',
    },
    day6: {
      longName: 'Saturday',
      shortName: 'Sat',
    },
    allDays: 'All days of the week',
  },
  weeks: {
    weekType0: {
      longName: 'Odd I (Chislitel I)',
      shortName: 'Odd I',
    },
    weekType1: {
      longName: 'Even I (Znamenatel I)',
      shortName: 'Even I',
    },
    weekType2: {
      longName: 'Odd II (Chislitel II)',
      shortName: 'Odd II',
    },
    weekType3: {
      longName: 'Even II (Znamenatel II)',
      shortName: 'Even II',
    },
    allWeekTypes: 'All week types',
  },
  time: {
    header: 'Class Time',
    class1: '1 class\n09:00 - 10:20',
    class2: '2 class\n10:30 - 11:50',
    class3: '3 class\n12:00 - 13:20\n12:30 - 13:50',
    class4: '4 class\n14:00 - 15:20',
    class5: '5 class\n15:30 - 16:50',
    class6: '6 class\n17:00 - 18:20',
    class7: '7 class\n18:30 - 19:50',
    class8: '8 class\n20:00 - 21:20',
  },
  table: {
    header: "Teacher's schedule",
    filters: {
      empty: "The teacher's classes for the selected filters were not found....",
      button: 'Reset filters',
      message: 'Filters are reset',
    },
    teacher: {
      empty: 'This teacher has no classes...',
      button: 'Reset teacher',
      message: 'Select a new teacher',
    },
  },
  serverError: {
    title: 'Server Error',
    subTitle:
      'Perhaps your VPN is enabled or the MIET server is not responding. Try disabling the VPN and reloading the page.',
  },
}
