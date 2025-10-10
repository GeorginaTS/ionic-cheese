import { Injectable, inject } from '@angular/core';
import { PushNotifications } from '@capacitor/push-notifications';
import { AuthService } from './auth.service';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root',
})
export class Push {
  private authService = inject(AuthService);
  private userService = inject(UserService);

  async addListeners() {
    await PushNotifications.addListener('registration', (token) => {
      console.info('Registration token: ', token.value);
      // Guardar el token a Firebase
      this.savePushToken(token.value);
    });

    await PushNotifications.addListener('registrationError', (err) => {
      console.error('🚨 Push notification registration error:', err.error);

      // Gestió específica segons el tipus d'error
      if (err.error.includes('TOO_MANY_REGISTRATIONS')) {
        console.warn(
          '🚨 TOO_MANY_REGISTRATIONS detected - attempting reset...'
        );
        this.handleTooManyRegistrations();
      } else if (err.error.includes('AUTHENTICATION_FAILED')) {
        console.error(
          '🔐 AUTHENTICATION_FAILED detected - Firebase configuration issue'
        );
        this.handleAuthenticationFailed();
      } else if (err.error.includes('INVALID_SENDER')) {
        console.error('📡 INVALID_SENDER detected - Check Firebase sender ID');
        this.handleInvalidSender();
      } else {
        console.error('❌ Unknown push notification error:', err.error);
      }
    });

    await PushNotifications.addListener(
      'pushNotificationReceived',
      (notification) => {
        console.log('Push notification received: ', notification);
      }
    );

    await PushNotifications.addListener(
      'pushNotificationActionPerformed',
      (notification) => {
        console.log(
          'Push notification action performed',
          notification.actionId,
          notification.inputValue
        );
      }
    );
  }
  async registerNotifications() {
    let permStatus = await PushNotifications.checkPermissions();

    if (permStatus.receive === 'prompt') {
      permStatus = await PushNotifications.requestPermissions();
    }

    if (permStatus.receive !== 'granted') {
      throw new Error('User denied permissions!');
    }

    await PushNotifications.register();
  }

  async getDeliveredNotifications() {
    const notificationList =
      await PushNotifications.getDeliveredNotifications();
    console.log('delivered notifications', notificationList);
  }

  /**
   * Guarda el token de push notifications a les dades de l'usuari només si ha canviat
   * @param token - El token de push notifications
   */
  private async savePushToken(token: string) {
    try {
      const currentUser = this.authService.currentUser;
      if (!currentUser) {
        console.warn('No user logged in, cannot save push token');
        return;
      }

      console.log(
        '🔔 Processing push token for authenticated user:',
        currentUser.uid
      );

      // Obtenir les dades actuals de l'usuari per comparar el token
      const userData = await new Promise<any>((resolve, reject) => {
        this.userService.getUserById(currentUser.uid).subscribe({
          next: (user) => resolve(user),
          error: (error) => reject(error),
        });
      });

      // Només actualitzar si el token ha canviat
      if (userData?.pushToken !== token) {
        console.log('🔄 Updating push token for user:', currentUser.uid);
        console.log('📱 New token:', token.substring(0, 20) + '...');
        await this.authService.updateUserProfile({
          pushToken: token,
        });
        console.log('✅ Push token updated successfully');
      } else {
        console.log('🔄 Push token unchanged, skipping update');
      }
    } catch (error: any) {
      console.error('💥 Error saving push token:', error);

      // Proporcionar més informació sobre l'error
      if (error.code === 'permission-denied') {
        console.error('🚫 Permission denied: Check Firestore security rules');
      } else if (error.code === 'unauthenticated') {
        console.error('🔐 User not authenticated: User must be logged in');
      }
    }
  }

  /**
   * Neteja els tokens de registre per evitar TOO_MANY_REGISTRATIONS
   */
  async clearRegistrationTokens() {
    try {
      console.log('🧹 Clearing push notification registration tokens...');

      // Desregistrar les notificacions push
      await PushNotifications.removeAllListeners();

      console.log('✅ Push notification tokens cleared successfully');
      return true;
    } catch (error) {
      console.error('❌ Error clearing push tokens:', error);
      return false;
    }
  }

  /**
   * Reinicia completament el sistema de push notifications
   */
  async resetPushNotifications() {
    try {
      console.log('🔄 Resetting push notification system...');

      // 1. Netejar listeners existents
      await this.clearRegistrationTokens();

      // 2. Esperar una mica abans de re-registrar
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // 3. Re-configurar listeners
      await this.addListeners();

      // 4. Re-registrar notificacions
      await this.registerNotifications();

      console.log('✅ Push notification system reset successfully');
      return true;
    } catch (error) {
      console.error('❌ Error resetting push notifications:', error);
      return false;
    }
  }

  /**
   * Gestiona l'error TOO_MANY_REGISTRATIONS
   */
  private async handleTooManyRegistrations() {
    try {
      console.log('🔧 Handling TOO_MANY_REGISTRATIONS error...');

      // Esperar uns segons abans d'intentar reset
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Intentar reset del sistema
      const resetSuccess = await this.resetPushNotifications();

      if (!resetSuccess) {
        console.error('❌ Failed to reset push notifications system');
        // Pots mostrar un toast o notificació a l'usuari aquí
      }
    } catch (error) {
      console.error('❌ Error handling TOO_MANY_REGISTRATIONS:', error);
    }
  }

  /**
   * Gestiona l'error AUTHENTICATION_FAILED
   */
  private handleAuthenticationFailed() {
    console.error('🔐 AUTHENTICATION_FAILED Error Details:');
    console.error('📋 Possible causes:');
    console.error('   1. google-services.json is missing or outdated');
    console.error('   2. SHA fingerprints not configured in Firebase Console');
    console.error('   3. Package name mismatch between app and Firebase');
    console.error('   4. Firebase project not properly initialized');

    console.log('🔧 To fix this issue:');
    console.log('   1. Verify google-services.json is in android/app/');
    console.log('   2. Check SHA fingerprints in Firebase Console');
    console.log('   3. Ensure package name matches in all configs');
    console.log('   4. Rebuild the app after config changes');
  }

  /**
   * Gestiona l'error INVALID_SENDER
   */
  private handleInvalidSender() {
    console.error('📡 INVALID_SENDER Error Details:');
    console.error('📋 Possible causes:');
    console.error('   1. Sender ID (Project Number) is incorrect');
    console.error('   2. google-services.json has wrong project configuration');
    console.error('   3. Firebase Cloud Messaging not enabled');

    console.log('🔧 To fix this issue:');
    console.log('   1. Check Sender ID in Firebase Console > Project Settings');
    console.log('   2. Download fresh google-services.json');
    console.log('   3. Enable Firebase Cloud Messaging in Firebase Console');
    console.log('   4. Verify capacitor.config.ts has correct configuration');
  }
}
