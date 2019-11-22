import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

const BASE_URL = 'http://localhost:5000/';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) { }

  putFaceAndRecognize(img: File): Observable<string> {
    const formData = new FormData();
    formData.append('file', img);
    return this.http.put<string>(BASE_URL, formData);
  }

  registerNewStudent(listImage: File[], studentInfo: string): Observable<string> {
    const formData = new FormData();
    listImage.forEach((file, index) => {
      formData.append('file' + index, file);
    });
    return this.http.put<string>(BASE_URL + studentInfo + '/', formData);
  }
}
