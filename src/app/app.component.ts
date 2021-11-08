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
  filteredName : string = '';
  /* isNegativeFilterSet : boolean = false; */
  activeSorting : string = '';
  gradeToAdd : Grade = {id:0,grade:0,student_id:0};

  constructor(private studentsService:StudentsService,private gradesService:GradesService){

  }

  ngOnInit(): void {
    this.loadStudents();
  }

  loadStudents(){
    this.studentsService.loadStudents().subscribe((data)=>{
      this.students = data;
      this.gradeToAdd.student_id = this.getSortedStudents()[0].id;
      this.loadGrades();
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
    /* this.isNegativeFilterSet = ! this.isNegativeFilterSet;
    if(this.isNegativeFilterSet){
      this.filteredGrades = [5];
    }else{
      this.filteredGrades = [];
    } */
    if(this.filteredGrades.length==1 && this.filteredGrades.includes(5)){
      this.filteredGrades = [];
    }else{
      this.filteredGrades = [5];
    }
  }

  setPositveFilter(){
    if(this.filteredGrades.length==4 && this.filteredGrades.includes(1) && this.filteredGrades.includes(2) && this.filteredGrades.includes(3) && this.filteredGrades.includes(4)){
      this.filteredGrades = [];
    }else{
      this.filteredGrades = [1,2,3,4];
    }
  }

  setNoGradeFilter(){
    if(this.filteredGrades.length==1 && this.filteredGrades.includes(0)){
      this.filteredGrades = [];
    }else{
      this.filteredGrades = [0];
    }
  }

  checkFilteredName(name:string){
    if(this.filteredName.trim()==''){
      return true;
    }else{
      return name.trim().toLowerCase().startsWith(this.filteredName.trim().toLowerCase(),0);
    }
  }

  sortByName(){
    if(this.activeSorting.toLowerCase()=='name' && this.activeSorting == 'name'){
        /*
        this.students.sort((a,b)=>{
        let result = b.lastname.localeCompare(a.lastname)
        if(result==0){
          result = b.firstname.localeCompare(a.firstname);
        }
        return result;
        });
        */
        this.students.reverse();
        this.activeSorting = 'NAME';
    }else{
      this.activeSorting = 'name';
      this.students.sort((a,b)=>{
        let result = a.lastname.localeCompare(b.lastname)
        if(result==0){
          result = a.firstname.localeCompare(b.firstname);
        }
        return result;
      });
    }
  }

  sortByFinalGrade(){
    if(this.activeSorting.toLowerCase()=='grade' && this.activeSorting == 'grade'){
      /* this.students.sort((a,b)=>this.getFinalGrade(b.id)-this.getFinalGrade(a.id)); */
      this.students.reverse();
      this.activeSorting = 'GRADE';
    }else{
      this.activeSorting = 'grade';
      this.students.sort((a,b)=>this.getFinalGrade(a.id)-this.getFinalGrade(b.id));
    }
  }

  sortByAge(){
    if(this.activeSorting.toLowerCase()=='age' && this.activeSorting == 'age'){
      /* this.students.sort((a,b)=>b.age - a.age); */
      this.students.reverse();
      this.activeSorting = 'AGE';
    }else{
      this.activeSorting = 'age';
      this.students.sort((a,b)=>a.age - b.age);
    }
  }

  getSortedStudents(){
    let studentArray = this.students.concat([]);
    return studentArray.sort((a,b)=>{
      let result = a.lastname.localeCompare(b.lastname)
      if(result==0){
        result = a.firstname.localeCompare(b.firstname);
      }
      return result;
    });
  }

  isGradeValid(){
    let isInteger = !Number.isInteger(this.gradeToAdd.grade);
    let isInRange = this.gradeToAdd.grade < 1 || this.gradeToAdd.grade > 5
    return isInRange || isInteger;
  }

  addGrade(){
    this.gradesService.addGrade(this.gradeToAdd).subscribe((grade)=>{
      this.loadStudents();
    });
  }

}