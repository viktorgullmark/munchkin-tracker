import 'rxjs/add/observable/of';
import 'rxjs/add/operator/catch';

import { Component } from '@angular/core';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { Platform } from 'ionic-angular';
import { SignalR } from 'ng2-signalr';
import { Observable } from 'rxjs/Observable';

import { TabsControllerPage } from '../pages/tabs-controller/tabs-controller';
import { InterceptorProvider } from '../providers/interceptor/interceptor';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage: any = TabsControllerPage;

  // An internal "copy" of the connection state stream used because
  //  we want to map the values of the original stream. If we didn't 
  //  need to do that then we could use the service's observable 
  //  right in the template.
  //   
  connectionState$: Observable<string>;

  players: any[] = [];

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, private interceptorProvider: InterceptorProvider, private _signalR: SignalR) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
    });
  }
}
