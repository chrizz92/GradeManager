import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Student } from '../models/student.model';

@Injectable({
  providedIn: 'root'
})
export class StudentsService {

  private url = 'http://localhost:3000/students';

  constructor(private http:HttpClient) { }

  loadStudents(){
    return this.http.get<Student[]>(this.url);
  }


}
