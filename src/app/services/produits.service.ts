// produits.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Produit } from '../model/protuit';
//import { Produit } from '../model/produit'; // Assurez-vous que le nom du fichier est correct

@Injectable({
  providedIn: 'root'
})
export class ProduitsService {
  urlHote = "http://localhost:9999/produits/";

  constructor(private http: HttpClient) { }

  getProduits(): Observable<Array<Produit>> {
    return this.http.get<Array<Produit>>(this.urlHote);
  }

  deleteProduit(idP: number | undefined): Observable<Produit> {
    return this.http.delete<Produit>(`${this.urlHote}${idP}`);
  }

  addProduit(produit: Produit): Observable<Produit> {
    return this.http.post<Produit>(this.urlHote, produit);
  }

  updateProduit(idP: number | undefined, nouveau: Produit): Observable<any> {
    return this.http.put(`${this.urlHote}${idP}`, nouveau);
  }
}
