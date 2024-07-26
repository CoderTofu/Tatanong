import { Component, NgZone } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FlashcardService } from '../../../service/flashcard.service';
import { FlashcardDeck } from '../../../../types';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';

const FILTER_PAG_REGEX = /[^0-9]/g;

@Component({
  selector: 'app-view',
  standalone: true,
  imports: [CommonModule, NgbPaginationModule],
  templateUrl: './view.component.html',
  styleUrl: './view.component.scss',
})
export class ViewComponent {
  searchID: string = '';
  flashcard: FlashcardDeck = {} as FlashcardDeck;

  constructor(
    private flashcardService: FlashcardService,
    private route: ActivatedRoute,
    private ngZone: NgZone // Add NgZone service
  ) {}

  ngOnInit() {
    this.searchID = this.route.snapshot.paramMap.get('searchID') as string;
    this.loadContent(this.searchID);
  }

  loadContent(searchID: string): void {
    const apiUrl: string = `http://localhost:5000/api/cardset/search/${searchID}`;

    this.flashcardService.getFlashcardDeck(apiUrl, {}).subscribe({
      next: (data: any) => {
        this.ngZone.run(() => {
          // Run the update inside the Angular zone
          this.flashcard = data;
        });
      },
      error: (error) => {
        alert('Flashcard deck not found'); // TODO: Create a 404 page and redirect to it
        console.log(error);
      },
    });
  }

  page = 1;

  getPageSymbol(current: number) {
    return ['A', 'B', 'C', 'D', 'E', 'F', 'G'][current - 1];
  }

  selectPage(page: string) {
    this.page = parseInt(page, 10) || 1;
  }

  formatInput(input: HTMLInputElement) {
    input.value = input.value.replace(FILTER_PAG_REGEX, '');
  }
}
