import { Component, OnInit } from '@angular/core';
import { CommonModule} from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButton } from '@ionic/angular/standalone';
import { MenuComponent } from 'src/app/components/menu/menu.component';
import { CheeseService } from '../../services/cheese.service';
import { Cheese } from '../../interfaces/cheese';
import { CheeseCardComponent } from "src/app/components/cheese-card/cheese-card.component";

@Component({
  selector: 'app-my-cheeses',
  templateUrl: './my-cheeses.page.html',
  styleUrls: ['./my-cheeses.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    CommonModule,
    FormsModule,
    MenuComponent,
    CheeseCardComponent,
    IonButton
],
})
export class MyCheesesPage implements OnInit {
  cheeses: Cheese[] = [];
  isLoading = true;
  errorMessage = '';
  constructor(private cheeseService: CheeseService) {}

  ngOnInit(): void {
    this.loadCheeses();
  }
  loadCheeses(): void {
    this.cheeseService.getAllCheeses().subscribe({
      next: (data) => {
        this.cheeses = data;
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = 'Error carregant els formatges.';
        this.isLoading = false;
        console.error(error);
      },
    });
  }
}
