import { Component, OnInit } from '@angular/core';
import { Student } from './models/student.model';
import { Grade } from './models/grade.model';
import { StudentsService } from './services/students.service';
import { GradesService } from './services/grades.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  
  students : Student[] = [];
  grades : Grade[] = [];
  filteredGrades : number[] = [];

  constructor(private studentsService:StudentsService,private gradesService:GradesService){
  
  }

  ngOnInit(): void {
    this.loadStudents();
    this.loadGrades();
  }

  loadStudents(){
    this.studentsService.loadStudents().subscribe((data)=>{
      this.students = data;
    });
  }

  loadGrades(){
    this.gradesService.loadGrades().subscribe((data)=>{
      this.grades = data;
    });
  }

  getGradesOfStudent(student_id:number){
    return this.grades.filter(grade => grade.student_id == student_id).map(grade=>grade.grade);
  }

  getBestGrade(id:number){
    let grades = this.getGradesOfStudent(id);
    if(grades.length!=0){
      return Math.min.apply(null,grades);
    }else{
      return "";
    }
  }

  getWorstGrade(id:number){
    let grades = this.getGradesOfStudent(id);
    if(grades.length!=0){
      return Math.max.apply(null,this.grades.filter(grade => grade.student_id == id).map(grade=>grade.grade));
    }else{
      return "";
    }
  }

  getFinalGrade(id:number){
    let grades = this.grades.filter(grade => grade.student_id == id).map(grade=>grade.grade);
    if(grades.length==0){
      return 0;
    }else if(this.getWorstGrade(id)==5){
      return 5;
    }else{
      return Math.round(grades.reduce((prev,curr)=>prev+curr)/grades.length);
    }
  }

  setGradeFilter(num:number){
    if(this.filteredGrades.includes(num)){
      this.filteredGrades.splice(this.filteredGrades.indexOf(num),1);
    }else{
      this.filteredGrades.push(num);
    }
  }

  isFilteredGrade(grade:number){
    if(this.filteredGrades.length==0){
      return true;
    }else{
      return this.filteredGrades.includes(grade);
    }
  }

  setNegativeFilter(){
    this.filteredGrades = [5];
  }
}
