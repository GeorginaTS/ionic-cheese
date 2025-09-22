import { Component, ElementRef, inject, OnInit } from '@angular/core';
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
  IonModal,
  IonNote,
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
  shareOutline,
  trashOutline,
} from 'ionicons/icons';
import { CheeseDetailComponent } from 'src/app/components/my-cheeses/cheese-detail/cheese-detail.component';
import { AddNoteModalComponent } from 'src/app/components/add-note-modal/add-note-modal.component';
import { CheesePhotoCaptureComponent } from 'src/app/components/my-cheeses/cheese-photo-capture/cheese-photo-capture.component';

import { CheeseElaborationComponent } from 'src/app/components/my-cheeses/cheese-elaboration/cheese-elaboration.component';
import { FocusManagerService } from 'src/app/services/focus-manager.service';
import { Share } from '@capacitor/share';
import { Dialog } from '@capacitor/dialog';
import { environment } from 'src/environments/environment';

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
    IonIcon,
    IonButton,
    IonBackButton,
    AddNoteModalComponent,
    IonModal,
    CheesePhotoCaptureComponent,
    CheeseDetailComponent,
    CheeseElaborationComponent,
    IonNote,
  ],
})
export class CheeseDetailPage implements OnInit {
  cheeseId: string = '';
  cheese: Cheese | null = null;
  isLoading: boolean = true;
  addNoteModalOpen = false;
  photoModalOpen = false;
  photo1: string | null = null;

  private route = inject(ActivatedRoute);
  private cheeseService = inject(CheeseService);
  private router = inject(Router);

  private focusManager = inject(FocusManagerService);
  private elementRef = inject(ElementRef);
  routeSub!: Subscription;
  constructor() {
    // Add icons to the IonIcon component
    addIcons({
      arrowBackCircleOutline: arrowBackCircleOutline,
      caretDownCircle,
      createOutline,
      trashOutline,
      shareOutline,
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
  ionViewWillEnter() {
    this.loadCheese();
  }
  ionViewWillLeave() {
    this.focusManager.clearFocus(this.elementRef);
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
  async deleteCheese(id: string) {
    const { value } = await Dialog.confirm({
      title: 'Confirm',
      message: `Are you sure you want to delete this cheese?`,
    });

    if (!value) {
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

  onPhotoModalDismiss() {
    this.photoModalOpen = false;
    this.focusManager.clearFocus(this.elementRef);
  }

  onAddNoteModalDismiss() {
    this.addNoteModalOpen = false;
    this.focusManager.clearFocus(this.elementRef);
  }

  async shareCheese(cheese: any) {
    await Share.share({
      title: cheese.name,
      text: `Check out this artisanal cheese: ${cheese.name} 🧀`,
      url: `${environment.apiUrl}/cheese/` + cheese.id,
      dialogTitle: 'Share this cheese',
    });
  }
}
