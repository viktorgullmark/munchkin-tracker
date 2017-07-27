import 'rxjs/add/observable/of';
import 'rxjs/add/operator/catch';
import { TabsPage } from '../pages/tabs/tabs';
import { InterceptorService } from '../services/interceptor-service/interceptor.service';
import { Component } from '@angular/core';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { Platform } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any = TabsPage;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, private interceptorService: InterceptorService) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();

      this.testCors().subscribe(res => {
        console.log(res);
      });
    });
  }

  public testCors(){
        return this.interceptorService.get('api/Games/1').map(res => {
            return res;
        }).catch(error => {
            return Observable.of(error);
        });
  }
}
