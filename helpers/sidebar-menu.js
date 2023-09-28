const getSidebarMenu = (role = 'USER') => {

  const menu = [
    {
      title: 'Home',
      icon: 'mdi mdi-gauge',
      submenu: [
        { title: 'Charts', url: '/dashboard/charts1' },
        { title: 'Progress bar', url: '/dashboard/progress' },
        { title: 'Promises', url: 'promises' },
        { title: 'Rxjs', url: 'rxjs' }
      ]
    },
    {
      title: 'Maintenance',
      icon: 'mdi mdi-folder-lock-open',
      submenu: [
        { title: 'Users', url: 'users' },
        { title: 'Hospitals', url: 'hospitals' },
        { title: 'Doctors', url: 'doctors' }
      ]
    }
  ];

  if (role === 'USER') {
    menu[1].submenu.splice(0, 1);
  }

  return menu;

};

module.exports = { getSidebarMenu };
