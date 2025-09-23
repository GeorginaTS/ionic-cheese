import { Component, AfterViewInit } from '@angular/core';
import * as L from 'leaflet';
import 'leaflet.markercluster';
import { WorldCheese } from 'src/app/interfaces/world-cheese';
import { WorldCheesesService } from 'src/app/services/world-cheeses.service';
import { Geolocation } from '@capacitor/geolocation';
import { IonContent } from '@ionic/angular/standalone';

@Component({
  selector: 'app-world-cheeses-map',
  templateUrl: './world-cheeses-map.component.html',
  styleUrls: ['./world-cheeses-map.component.scss'],
  imports: [IonContent],
  standalone: true,
})
export class WorldCheesesMapComponent implements AfterViewInit {
  private map!: L.Map;
  // Use any type to avoid TypeScript issues with the marker cluster
  private markers!: any;
  cheeses: WorldCheese[] = [];
  userLatLng: L.LatLng = new L.LatLng(48.85, 2.35); // fallback a París
  private isMobile: boolean = false;

  cheeseIcon = L.icon({
    iconUrl: 'assets/icon/cheese.png',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -30],
  });

  constructor(private worldCheesesService: WorldCheesesService) {}

  async ngAfterViewInit() {
    // 1. Inicialitzar mapa
    this.map = L.map('map').setView(this.userLatLng, 5);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(this.map);

    try {
      // @ts-ignore - Ignore the TypeScript error for markerClusterGroup
      this.markers = L.markerClusterGroup();
      this.map.addLayer(this.markers);
    } catch (error) {
      console.error('Error initializing marker cluster group:', error);
      // Fallback to regular feature group if marker cluster fails
      this.markers = new L.FeatureGroup();
      this.map.addLayer(this.markers);
    }

    // 2. Geolocalització òptima per mòbils i ordinadors
    try {
      console.log('📍 Iniciant geolocalització òptima...');

      // DETECTAR SI ÉS DISPOSITIU MÒBIL
      this.isMobile =
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          navigator.userAgent
        );
      console.log('📱 Dispositiu mòbil detectat:', this.isMobile);

      // COMPROVAR PERMISOS PRIMER (important per mòbils)
      try {
        console.log('🔐 Comprovant permisos de geolocalització...');
        const permissions = await Geolocation.checkPermissions();
        console.log('✅ Permisos actuals:', permissions);

        if (permissions.location === 'denied') {
          throw new Error('Permisos de geolocalització denegats');
        }
      } catch (permError) {
        console.warn('⚠️ Error comprovant permisos:', permError);
      }

      // CONFIGURACIÓ ÒPTIMA PER MÒBILS
      const gpsOptions = this.isMobile
        ? {
            enableHighAccuracy: true, // Força GPS en mòbils
            timeout: 20000, // 20s per obtenir senyal GPS
            maximumAge: 60000, // Accepta ubicacions d'1 minut
          }
        : {
            enableHighAccuracy: true, // Intenta WiFi positioning
            timeout: 10000, // 10s per ordinadors
            maximumAge: 300000, // 5 minuts per ordinadors
          };

      console.log('🎯 Intentant GPS amb configuració òptima:', gpsOptions);

      const coords = await Geolocation.getCurrentPosition(gpsOptions);

      console.log('✅ Coordenades obtingudes:', coords.coords);
      console.log('📏 Precisió:', coords.coords.accuracy, 'metres');
      console.log('📊 Font:', this.isMobile ? 'GPS/Xarxa mòbil' : 'WiFi/IP');

      // VALIDAR PRECISIÓ SEGONS DISPOSITIU
      const maxAccuracy = this.isMobile ? 1000 : 50000; // 1km per mòbil, 50km per ordinador
      const acceptableAccuracy = coords.coords.accuracy <= maxAccuracy;

      if (acceptableAccuracy) {
        this.userLatLng = new L.LatLng(
          coords.coords.latitude,
          coords.coords.longitude
        );

        // Zoom diferent segons precisió
        const zoom =
          coords.coords.accuracy < 100
            ? 13 // GPS precisa
            : coords.coords.accuracy < 1000
            ? 10 // Xarxa mòbil
            : coords.coords.accuracy < 5000
            ? 8 // WiFi
            : 6; // IP aproximada

        // Forçar que Leaflet recalculi mida abans de centrar
        this.map.invalidateSize();

        this.map.setView(this.userLatLng, zoom);

        // MARCADOR AMB INFO DETALLADA
        const sourceText = this.isMobile
          ? 'GPS mòbil'
          : coords.coords.accuracy < 1000
          ? 'xarxa'
          : 'IP';
        const accuracyText =
          coords.coords.accuracy < 1000
            ? `${Math.round(coords.coords.accuracy)}m`
            : `~${Math.round(coords.coords.accuracy / 1000)}km`;

        const userMarker = L.marker(this.userLatLng)
          .addTo(this.map)
          .bindPopup(
            `📍 Ubicació per ${sourceText} (precisió: ${accuracyText})`
          );

        // Obrir popup després d'un petit delay per assegurar que el mapa estigui centrat
        setTimeout(() => {
          userMarker.openPopup();
        }, 100);

        console.log(`✅ Geolocalització exitosa via ${sourceText}`);

        // GUARDAR ÚLTIMA UBICACIÓ CONEGUDA
        this.saveLastLocation(coords.coords);
      } else {
        console.warn(
          `⚠️ Precisió insuficient: ${coords.coords.accuracy}m - Utilitzant Barcelona com a ubicació per defecte`
        );
        // Quan la precisió no és acceptable, utilitzar Barcelona com a ubicació per defecte
        this.userLatLng = new L.LatLng(41.3851, 2.1734); // Barcelona

        // Forçar que Leaflet recalculi mida abans de centrar
        this.map.invalidateSize();

        this.map.setView(this.userLatLng, 8);

        // MARCADOR PER DEFECTE A BARCELONA
        const defaultMarker = L.marker(this.userLatLng)
          .addTo(this.map)
          .bindPopup(
            '📍 Ubicació per defecte (Barcelona) - Precisió insuficient'
          );

        // Obrir popup després d'un petit delay per assegurar que el mapa estigui centrat
        setTimeout(() => {
          defaultMarker.openPopup();
        }, 100);

        console.log('✅ Utilitzant ubicació per defecte: Barcelona');
      }
    } catch (err) {
      console.error('❌ Geolocalització fallida:', err);

      // INTENTAR RECUPERAR ÚLTIMA UBICACIÓ CONEGUDA
      const lastLocation = this.getLastLocation();
      if (lastLocation) {
        console.log('� Utilitzant última ubicació coneguda');
        this.userLatLng = new L.LatLng(
          lastLocation.latitude,
          lastLocation.longitude
        );

        // Forçar que Leaflet recalculi mida abans de centrar
        this.map.invalidateSize();

        this.map.setView(this.userLatLng, 8);

        const lastLocationMarker = L.marker(this.userLatLng)
          .addTo(this.map)
          .bindPopup('📍 Última ubicació coneguda (offline)');

        // Obrir popup després d'un petit delay per assegurar que el mapa estigui centrat
        setTimeout(() => {
          lastLocationMarker.openPopup();
        }, 100);
      } else {
        // CUSTOM ERROR MESSAGE
        const errorMsg = this.isMobile
          ? 'Could not get your GPS location.\n\nMake sure that:\n• GPS is enabled\n• You have good coverage\n• You have granted permissions to the app'
          : 'Could not get your location.\n\nOn computers, accuracy is limited.\nTry enabling geolocation in the browser.';

        alert(errorMsg);
        this.userLatLng = new L.LatLng(41.3851, 2.1734); // Barcelona per defecte

        // Forçar que Leaflet recalculi mida abans de centrar
        this.map.invalidateSize();

        this.map.setView(this.userLatLng, 8);

        // MARCADOR PER DEFECTE QUAN FALLA TOT
        const fallbackMarker = L.marker(this.userLatLng)
          .addTo(this.map)
          .bindPopup('📍 Ubicació per defecte (Barcelona)');

        // Obrir popup després d'un petit delay per assegurar que el mapa estigui centrat
        setTimeout(() => {
          fallbackMarker.openPopup();
        }, 100);
      }
    }

    // 3. Carregar formatges
    this.worldCheesesService.getAllCheeses().subscribe((cheeses) => {
      this.cheeses = cheeses;

      this.cheeses.forEach((c) => {
        const lat = Number(c.latitude);
        const lng = Number(c.longitude);
        if (isNaN(lat) || isNaN(lng)) return;

        const marker = L.marker([lat, lng], { icon: this.cheeseIcon });

        const distance =
          this.userLatLng.distanceTo(new L.LatLng(lat, lng)) / 1000; // km

        marker.bindPopup(`
          <b>${c.name}</b><br>
          ${c.origin_city}, ${c.origin_country}<br>
          🥛 ${c.milk_type} milk<br>
          💶 ${c.price} €<br>
          📍 Distance: ${distance.toFixed(2)} km
        `);

        this.markers.addLayer(marker);
      });

      // Forçar que Leaflet recalculi mida
      setTimeout(() => this.map.invalidateSize(), 300);
    });
  }

  // MÈTODES PER GESTIONAR ÚLTIMA UBICACIÓ CONEGUDA
  private saveLastLocation(coords: any): void {
    const locationData = {
      latitude: coords.latitude,
      longitude: coords.longitude,
      accuracy: coords.accuracy,
      timestamp: Date.now(),
    };
    localStorage.setItem('lastKnownLocation', JSON.stringify(locationData));
  }

  private getLastLocation(): any {
    const saved = localStorage.getItem('lastKnownLocation');
    if (!saved) return null;

    try {
      const locationData = JSON.parse(saved);
      // Comprovar si té menys de 24 hores
      if (Date.now() - locationData.timestamp > 24 * 60 * 60 * 1000) {
        localStorage.removeItem('lastKnownLocation');
        return null;
      }
      return locationData;
    } catch {
      return null;
    }
  }
}
