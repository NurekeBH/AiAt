import { NavigationActions, StackActions } from 'react-navigation';

let _navigator;

function setTopLevelNavigator(navigatorRef) {
  _navigator = navigatorRef;
}



function goBack() {
 
  _navigator.goBack()
  
}

// add other navigation functions that you need and export them

export default {
  goBack,
  setTopLevelNavigator,
 
};