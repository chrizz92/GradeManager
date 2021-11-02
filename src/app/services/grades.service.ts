import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Grade } from '../models/grade.model';

@Injectable({
  providedIn: 'root'
})
export class GradesService {

  private url = 'http://localhost:3000/grades';

  constructor(private http:HttpClient) { }

  loadGrades(){
    return this.http.get<Grade[]>(this.url);
  }
}
