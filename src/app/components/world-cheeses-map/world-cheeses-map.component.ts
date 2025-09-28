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

    // 2. OBTENIR UBICACIÓ USUARI (SIMPLIFICAT)
    let finalCoords: any = null;
    let locationAccuracy = '';
    let locationName = '';

    try {
      console.log('📍 Iniciant geolocalització òptima...');

      // DETECTAR DISPOSITIU
      this.isMobile =
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          navigator.userAgent
        );

      // COMPROVAR PERMISOS
      const permissions = await Geolocation.checkPermissions();
      if (permissions.location === 'denied') {
        throw new Error('Permisos denegats');
      }

      // CONFIGURACIÓ GPS
      const gpsOptions = this.isMobile
        ? { enableHighAccuracy: true, timeout: 20000, maximumAge: 60000 }
        : { enableHighAccuracy: true, timeout: 10000, maximumAge: 300000 };

      const coords = await Geolocation.getCurrentPosition(gpsOptions);

      // VALIDAR PRECISIÓ
      const maxAccuracy = this.isMobile ? 1000 : 50000;
      if (coords.coords.accuracy <= maxAccuracy) {
        finalCoords = coords.coords;
        locationAccuracy =
          coords.coords.accuracy < 1000
            ? `${Math.round(coords.coords.accuracy)}m`
            : `~${Math.round(coords.coords.accuracy / 1000)}km`;
        locationName = await this.getLocationName(
          coords.coords.latitude,
          coords.coords.longitude
        );
        this.saveLastLocation(coords.coords);
        console.log('✅ GPS exitós:', locationName);
      } else {
        throw new Error('Precisió insuficient');
      }
    } catch (err) {
      console.warn('❌ GPS fallat:', err);

      // INTENTAR ÚLTIMA UBICACIÓ CONEGUDA
      const lastLocation = this.getLastLocation();
      if (lastLocation) {
        finalCoords = lastLocation;
        locationAccuracy =
          lastLocation.accuracy < 1000
            ? `${Math.round(lastLocation.accuracy)}m`
            : `~${Math.round(lastLocation.accuracy / 1000)}km`;
        locationName = await this.getLocationName(
          lastLocation.latitude,
          lastLocation.longitude
        );
        console.log('✅ Última ubicació:', locationName);
      } else {
        // BARCELONA PER DEFECTE
        finalCoords = { latitude: 41.3851, longitude: 2.1734 };
        locationAccuracy = 'default';
        locationName = 'Barcelona';
        console.log('✅ Ubicació per defecte: Barcelona');
      }
    }

    // 3. CREAR MARCADOR USUARI FINAL
    this.userLatLng = new L.LatLng(finalCoords.latitude, finalCoords.longitude);

    // DETERMINAR ZOOM SEGONS ACCURACY
    const zoom =
      locationAccuracy === 'default'
        ? 8
        : finalCoords.accuracy < 100
        ? 13
        : finalCoords.accuracy < 1000
        ? 10
        : finalCoords.accuracy < 5000
        ? 8
        : 6;

    this.map.invalidateSize();
    this.map.setView(this.userLatLng, zoom);

    // MARCADOR ÚNIC AMB INFO SIMPLIFICADA
    const userMarker = L.marker(this.userLatLng)
      .addTo(this.map)
      .bindPopup(`${locationName}<br><small>(${locationAccuracy})</small>`);

    setTimeout(() => {
      userMarker.openPopup();
    }, 100);

    // 4. Carregar formatges
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

  // MÈTODE PER OBTENIR EL NOM DE LA POBLACIÓ DES DE COORDENADES
  private async getLocationName(lat: number, lng: number): Promise<string> {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=10&addressdetails=1`
      );

      if (!response.ok) {
        throw new Error('Geocoding request failed');
      }

      const data = await response.json();

      // Intentar obtenir el nom de la ciutat/població
      const address = data.address;
      const cityName =
        address?.city ||
        address?.town ||
        address?.village ||
        address?.municipality ||
        address?.county ||
        address?.state ||
        'Unknown location';

      return cityName;
    } catch (error) {
      console.warn('Error getting location name:', error);
      return 'Unknown location';
    }
  }
}
