import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProduitsComponent } from './produits.component';

describe('ProduitsComponent', () => {
  let component: ProduitsComponent;
  let fixture: ComponentFixture<ProduitsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProduitsComponent]
    });

    // Créer une instance du composant et de sa fixture
    fixture = TestBed.createComponent(ProduitsComponent);
    component = fixture.componentInstance;

    // Déclencher la détection des modifications pour initialiser le composant
    fixture.detectChanges();
  });

  it('should create', () => {
    // S'assurer que le composant a été créé avec succès
    expect(component).toBeTruthy();
  });

  // Ajouter d'autres tests ici si nécessaire
});
