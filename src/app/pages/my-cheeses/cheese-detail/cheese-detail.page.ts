import { Component, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonSpinner,
  IonAccordion,
  IonItem,
  IonLabel,
  IonAccordionGroup,
  IonIcon,
  IonButton,
  IonBackButton,
  IonModal
} from '@ionic/angular/standalone';
import { ActivatedRoute, ParamMap, Router, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { Cheese } from 'src/app/interfaces/cheese';
import { CheeseService } from 'src/app/services/cheese.service';
import { MenuComponent } from 'src/app/components/menu/menu.component';

import { addIcons } from 'ionicons';
import {
  arrowBackCircleOutline,
  caretDownCircle,
  caretDownCircleOutline,
  createOutline,
} from 'ionicons/icons';
import { CheeseDetailComponent } from 'src/app/components/cheese-detail/cheese-detail.component';
import { AddNoteModalComponent } from "src/app/components/add-note-modal/add-note-modal.component";
import { CheesePhotoCaptureComponent } from "src/app/components/cheese-photo-capture/cheese-photo-capture.component";

@Component({
  selector: 'app-cheese-detail-page',
  templateUrl: './cheese-detail.page.html',
  styleUrls: ['./cheese-detail.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    CommonModule,
    FormsModule,
    MenuComponent,
    CheeseDetailComponent,
    IonSpinner,
    IonAccordion,
    IonItem,
    IonLabel,
    IonAccordionGroup,
    IonIcon,
    IonButton,
    IonBackButton,
    AddNoteModalComponent,
    IonModal,
    CheesePhotoCaptureComponent
],
})
export class CheeseDetailPage implements OnInit {
  cheeseId: string = '';
  cheese: Cheese | null = null;
  isLoading: boolean = true;
  addNoteModalOpen = false;
  photoModalOpen = false;

  private routeSub!: Subscription;
  constructor(
    private route: ActivatedRoute,
    private cheeseService: CheeseService,
    private router: Router
  ) {
    // Add icons to the IonIcon component
    addIcons({
      arrowBackCircleOutline: arrowBackCircleOutline,
      caretDownCircle,
      createOutline,
    });
  }
  ngOnInit(): void {
    this.routeSub = this.route.paramMap.subscribe((params: ParamMap): void => {
      const id: string | null = params.get('id');
      if (id) {
        this.cheeseId = id;
        this.loadCheese();
      }
    });
  }
  loadCheese(): void {
    this.isLoading = true;

    this.cheeseService.getCheeseById(this.cheeseId).subscribe({
      next: (response: { msg: string; cheese: Cheese }): void => {
        this.cheese = response.cheese;
        this.isLoading = false;
        console.log('Formatge carregat:', this.cheese._id);
      },
      error: (error: any): void => {
        console.error('Error carregant el formatge:', error);
        this.isLoading = false;
      },
    });
  }
  deleteCheese(id: string) {
    const confirmed = window.confirm(
      'are you sure you want to delete this cheese?'
    );
    if (!confirmed) {
      return;
    }
    this.cheeseService.deleteCheese(id).subscribe({
      next: (response) => {
        console.log('Formatge eliminat:', response);
        this.router.navigate(['/my-cheeses']);
      },
      error: (error) => {
        console.error('Error eliminant el formatge:', error);
      },
    });
  }
  addNote() {
    // Logic to add a note can be implemented here
    this.addNoteModalOpen = true;
  
  }
  openPhotoModal() {
    this.photoModalOpen = true;
  }
}
