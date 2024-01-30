import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ProduitsService } from '../services/produits.service';
import { Produit } from '../model/protuit';

@Component({
  selector: 'app-ajout-produit',
  templateUrl: './ajout-produit.component.html',
  styleUrls: ['./ajout-produit.component.css']
})
export class AjoutProduitComponent implements OnInit {
  nouveauProduit: Produit = {
    id: undefined,
    code: '',
    designation: '',
    prix: undefined
  };

  listeProduits: Produit[] = [];
  produitCourant: Produit | null = null;

  constructor(private produitsService: ProduitsService, private cdRef: ChangeDetectorRef) { }

  ngOnInit() {
    this.chargerListeProduits();
  }

  validerFormulaire() {
    if (this.produitCourant) {
      this.mettreAJourProduit();
    } else {
      this.ajouterProduit();
    }
  }

  ajouterProduit() {
    this.produitsService.addProduit(this.nouveauProduit).subscribe(
      (nouveauProduit: Produit) => {
        console.log("Succès POST", nouveauProduit);
        this.listeProduits.unshift(nouveauProduit);
        this.effacerFormulaire();
        // Forcer la détection des changements
        this.cdRef.detectChanges();
      },
      (error: any) => {
        //  console.error("Erreur POST", error);
      }
    );
  }

  mettreAJourProduit() {
    if (this.produitCourant) {
      this.produitsService.updateProduit(this.produitCourant.id, this.produitCourant).subscribe(
        (updatedProduit: Produit) => {
          console.log("Mise à jour réussie.", updatedProduit);
          const index = this.listeProduits.findIndex(p => p.id === updatedProduit.id);
          if (index !== -1) {
            this.listeProduits[index] = { ...updatedProduit };
          }
          // Forcer la détection des changements
          this.cdRef.detectChanges();
          this.effacerFormulaire();
        },
        (error: any) => {
          console.error("Erreur lors de la mise à jour du produit", error);
        }
      );
    }
  }

  effacerFormulaire() {
    this.nouveauProduit = {
      id: undefined,
      code: '',
      designation: '',
      prix: undefined
    };
    this.produitCourant = null;
  }

  chargerListeProduits() {
    this.produitsService.getProduits().subscribe(
      (data: Produit[]) => {
        this.listeProduits = data;
        // Forcer la détection des changements
        this.cdRef.detectChanges();
      },
      (error: any) => {
        console.error("Erreur lors de la récupération des produits", error);
      }
    );
  }

  editerProduit(produit: Produit) {
    this.produitCourant = { ...produit };
  }

  supprimerProduit(produit: Produit) {
    if (confirm("Voulez-vous vraiment supprimer ce produit?")) {
      this.produitsService.deleteProduit(produit.id).subscribe(
        () => {
          console.log("Produit supprimé avec succès.", produit);
          this.listeProduits = this.listeProduits.filter(p => p.id !== produit.id);
          // Forcer la détection des changements
          this.cdRef.detectChanges();
        },
        (error: any) => {
          console.error("Erreur lors de la suppression du produit", error);
        }
      );
    }
  }
}
