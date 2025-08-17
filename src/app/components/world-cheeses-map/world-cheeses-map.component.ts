import { Component, AfterViewInit } from '@angular/core';
import * as L from 'leaflet';
import 'leaflet.markercluster';
import { WorldCheese } from 'src/app/interfaces/world-cheese';
import { WorldCheesesService } from 'src/app/services/world-cheeses.service';
import { Geolocation } from '@capacitor/geolocation';
import { IonContent } from "@ionic/angular/standalone";

@Component({
  selector: 'app-world-cheeses-map',
  templateUrl: './world-cheeses-map.component.html',
  styleUrls: ['./world-cheeses-map.component.scss'],
  imports: [IonContent]
})
export class WorldCheesesMapComponent implements AfterViewInit {
  private map!: L.Map;
  private markers!: L.MarkerClusterGroup;
  cheeses: WorldCheese[] = [];
  userLatLng: L.LatLng = new L.LatLng(48.85, 2.35); // fallback a París

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

    this.markers = L.markerClusterGroup();
    this.map.addLayer(this.markers);

    // 2. Obtenir posició de l'usuari
    try {
      const coords = await Geolocation.getCurrentPosition();
      this.userLatLng = new L.LatLng(coords.coords.latitude, coords.coords.longitude);
      this.map.setView(this.userLatLng, 6);

      // marcador de la posició de l'usuari
      L.marker(this.userLatLng).addTo(this.map).bindPopup('La teva ubicació').openPopup();
    } catch (err) {
      console.warn('No s’ha pogut obtenir la geolocalització, s’utilitza fallback', err);
    }

    // 3. Carregar formatges
    this.worldCheesesService.getAllCheeses().subscribe((cheeses) => {
      this.cheeses = cheeses;

      this.cheeses.forEach((c) => {
        const lat = Number(c.latitude);
        const lng = Number(c.longitude);
        if (isNaN(lat) || isNaN(lng)) return;

        const marker = L.marker([lat, lng], { icon: this.cheeseIcon });

        const distance = this.userLatLng.distanceTo([lat, lng]) / 1000; // km

        marker.bindPopup(`
          <b>${c.name}</b><br>
          ${c.origin_city}, ${c.origin_country}<br>
          🥛 ${c.milk_type} milk<br>
          💶 ${c.price} €<br>
          📍 Distància: ${distance.toFixed(2)} km
        `);

        this.markers.addLayer(marker);
      });

      // Forçar que Leaflet recalculi mida
      setTimeout(() => this.map.invalidateSize(), 300);
    });
  }
}
