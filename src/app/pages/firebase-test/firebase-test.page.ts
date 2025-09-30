import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonButton,
  IonItem,
  IonLabel,
} from '@ionic/angular/standalone';
import { Database, ref, set, get } from '@angular/fire/database';

@Component({
  selector: 'app-firebase-test',
  templateUrl: './firebase-test.page.html',
  styleUrls: ['./firebase-test.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    CommonModule,
    IonButton,
    IonItem,
    IonLabel,
  ],
})
export class FirebaseTestPage implements OnInit {
  private database = inject(Database);

  testResult = '';
  isConnected = false;

  constructor() {}

  ngOnInit() {
    this.testFirebaseConnection();
  }

  async testFirebaseConnection() {
    try {
      console.log('Testing Firebase connection...');
      this.testResult = 'Testing connection...';

      // Test write
      const testRef = ref(this.database, 'test/connection');
      await set(testRef, {
        timestamp: Date.now(),
        message: 'Connection test successful',
      });

      // Test read
      const snapshot = await get(testRef);
      if (snapshot.exists()) {
        this.isConnected = true;
        this.testResult =
          'Firebase connection successful! Data: ' +
          JSON.stringify(snapshot.val());
        console.log('Firebase test successful:', snapshot.val());
      } else {
        this.testResult = 'Data was written but could not be read back';
      }
    } catch (error) {
      console.error('Firebase test error:', error);
      this.testResult =
        'Firebase connection failed: ' + (error as Error).message;
      this.isConnected = false;
    }
  }

  async testWrite() {
    try {
      const testRef = ref(this.database, 'test/manual-' + Date.now());
      await set(testRef, {
        timestamp: Date.now(),
        message: 'Manual test write',
        random: Math.random(),
      });
      this.testResult += '\n✓ Manual write successful';
    } catch (error) {
      this.testResult += '\n✗ Manual write failed: ' + (error as Error).message;
    }
  }
}
