import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProduitsService } from '../services/produits.service';
import { Produit } from '../model/protuit';
//import { Produit } from '../model/produit';

@Component({
  selector: 'app-produits',
  templateUrl: './produits.component.html',
  styleUrls: ['./produits.component.css']
})
export class ProduitsComponent implements OnInit {
  produits: Produit[] = [];
  produitForm: FormGroup;
  afficherFormulaire = false; // Variable pour afficher/cacher le formulaire
  produitCourant: Produit | null = null;

  constructor(private produitsService: ProduitsService, private fb: FormBuilder) {
    this.produitForm = this.fb.group({
      id: [{ value: null, disabled: true }, Validators.required],
      code: [''],
      designation: [''],
      prix: ['']
    });
  }

  ngOnInit(): void {
    this.consulterProduits();
  }

  consulterProduits() {
    this.produitsService.getProduits().subscribe(
      (data: Produit[]) => {
        this.produits = data;
      },
      (error: any) => {
        console.error("Erreur lors de la récupération des produits", error);
      }
    );
  }

  supprimerProduit(produit: Produit) {
    const confirmation = confirm(`Voulez-vous supprimer le produit : ${produit.designation} ?`);
    if (confirmation) {
      this.produitsService.deleteProduit(produit.id).subscribe(
        () => this.handleSuppressionReussie(produit),
        (error: any) => this.handleSuppressionEchouee(error)
      );
    } else {
      console.log("Suppression annulée...");
    }
  }

  private handleSuppressionReussie(produit: Produit) {
    console.log("Succès DELETE");
    const index = this.produits.indexOf(produit);
    if (index !== -1) {
      this.produits.splice(index, 1);
    }
  }

  private handleSuppressionEchouee(error: any) {
    console.error("Erreur DELETE", error);
    // Gérer l'erreur ici, par exemple, afficher un message à l'utilisateur.
  }

  validerFormulaire() {
    if (this.produitForm.valid) {
      this.mettreAJourProduit();
    }
  }

  private mettreAJourProduit() {
    const produitMaj: Produit = {
      id: this.produitForm.value.id as number,
      code: this.produitForm.value.code as string,
      designation: this.produitForm.value.designation as string,
      prix: this.produitForm.value.prix as number
    };

    this.produitsService.updateProduit(this.produitForm.value.id, produitMaj).subscribe(
      (updatedProduit: Produit) => {
        console.log("Mise à jour réussie.", updatedProduit);
        this.metAjourProduitsLocaux(updatedProduit);

        // Cache le formulaire après la validation réussie
        this.afficherFormulaire = false;
      },
      (error: any) => {
        console.error("Erreur lors de la mise à jour du produit", error);
      }
    );
  }

  private metAjourProduitsLocaux(updatedProduit: Produit) {
    const index = this.produits.findIndex(p => p.id === updatedProduit.id);
    if (index !== -1) {
      this.produits[index] = updatedProduit;
    }
  }

  editerProduit(produit: Produit) {
    // Affiche le formulaire uniquement lors de l'édition
    this.afficherFormulaire = true;

    // Mettez à jour le formulaire avec les détails du produit à éditer
    this.produitForm.setValue(produit);
  }
}
