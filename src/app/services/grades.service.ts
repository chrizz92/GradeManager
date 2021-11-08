import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Grade } from '../models/grade.model';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':'application/json'
  })
};

@Injectable({
  providedIn: 'root'
})
export class GradesService {

  private url = 'http://localhost:3000/grades';

  constructor(private http:HttpClient) { }

  loadGrades(){
    return this.http.get<Grade[]>(this.url);
  }

  addGrade(grade:Grade){
    return this.http.post<Grade>(this.url,grade,httpOptions);
  }
}
