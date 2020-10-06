import React from 'react';
import Home from './Home'
import Login from './Login'
import LoginStudent from './LoginStudent'
import createCourses from './createCourses'
import ConnectTeacher from './ConnectTeacher'
import ConnectStudent from './ConnectStudent'
import homeWork from './homeWork'
import task from './task'
import insertCode from './insertCode'
import courseByCode from './courseByCode'
import taskStudent from './taskStudent'
import video from './video'
import {createAppContainer} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
/*export default class App extends React.Component{

}*/
const RootStack=createStackNavigator({
  Home:{screen:Home},
  Login:{screen:Login},
  LoginStudent:{screen:LoginStudent},
  ConnectStudent:{screen:ConnectStudent},
  createCourses:{screen:createCourses},
  ConnectTeacher:{screen:ConnectTeacher},
  homeWork:{screen:homeWork},
  task:{screen:task},
  insertCode:{screen:insertCode},
  courseByCode:{screen:courseByCode},
  video:{screen:video},
  taskStudent:{screen:taskStudent}
});

const App=createAppContainer(RootStack);
export default App;

