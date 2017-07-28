import 'rxjs/add/observable/of';
import 'rxjs/add/operator/catch';
import { TabsPage } from '../pages/tabs/tabs';
import { InterceptorService } from '../services/interceptor-service/interceptor.service';
import { Component, OnInit } from '@angular/core';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { Platform } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';
import { SignalR, BroadcastEventListener } from 'ng2-signalr';
import { TestModel } from '../models/test.model';
import * as $ from 'jquery';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage: any = TabsPage;

  // An internal "copy" of the connection state stream used because
  //  we want to map the values of the original stream. If we didn't 
  //  need to do that then we could use the service's observable 
  //  right in the template.
  //   
  connectionState$: Observable<string>;

  testMessages: any[] = [];

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, private interceptorService: InterceptorService, private _signalR: SignalR) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();

      this.testCors().subscribe(res => {
        console.log(res);
      });

      this.testSignalR();
    });
  }

  public testCors() {
    return this.interceptorService.get('api/Games/1').map(res => {
      return res;
    }).catch(error => {
      return Observable.of(error);
    });
  }

  public testSignalR() {
    this._signalR.connect().then((c) => {
      console.log('connected');

      // 1.create a listener object
      let onMessageSent$ = new BroadcastEventListener<TestModel>('NewMessage');

      // 2.register the listener
      c.listen(onMessageSent$);

      // 3.subscribe for incoming messages
      onMessageSent$.subscribe((testMessage: TestModel) => {
        this.testMessages.push(testMessage);
        console.log(this.testMessages);
      });

      // invoke a server side method, with parameters
      c.invoke('TestMessage', 'test').then((data) => {
        console.log('invoked');
      });
    });
  }

  ngOnInit() {
  }
}
