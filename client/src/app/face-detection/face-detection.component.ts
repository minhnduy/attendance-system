import { ApiService } from './../services/api.service';
import { Component, OnInit, ViewChild, AfterViewInit, ElementRef, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { NgOpenCVService, OpenCVLoadResult } from 'ng-open-cv';
import { tap, switchMap, filter } from 'rxjs/operators';
import { forkJoin, Observable, empty, fromEvent, BehaviorSubject, Observer, Subject } from 'rxjs';
import { NgxPicaService } from '@digitalascetic/ngx-pica';

@Component({
  selector: 'app-face-detection',
  templateUrl: './face-detection.component.html',
  styleUrls: ['./face-detection.component.css']
})
export class FaceDetectionComponent implements AfterViewInit, OnInit {
  imageUrl = 'assets/DaveChappelle.jpg';
  private classifiersLoaded = new BehaviorSubject<boolean>(false);
  classifiersLoaded$ = this.classifiersLoaded.asObservable();

  @ViewChild('fileInput')
  fileInput: ElementRef;
  @ViewChild('canvasInput')
  canvasInput: ElementRef;
  @ViewChild('canvasOutput')
  canvasOutput: ElementRef;
  src: any;
  dst: any;
  cap: any;
  nameOfFace = { name: '' };
  isOpenedCamera = false;
  stream: any;

  listStudent = [];

  constructor(
    private ngOpenCVService: NgOpenCVService,
    private ngxPicaService: NgxPicaService,
    @Inject(DOCUMENT) private document: Document,
    private apiService: ApiService) {

  }

  ngOnInit() {
    this.ngOpenCVService.isReady$
      .pipe(
        filter((result: OpenCVLoadResult) => result.ready),
        switchMap(() => {
          return this.loadClassifiers();
        })
      )
      .subscribe(() => {
        this.classifiersLoaded.next(true);
      });
  }

  ngAfterViewInit(): void {
    // Here we just load our example image to the canvas
    this.ngOpenCVService.isReady$
      .pipe(
        filter((result: OpenCVLoadResult) => result.ready),
        tap((result: OpenCVLoadResult) => {
          //this.ngOpenCVService.loadImageToHTMLCanvas(this.imageUrl, this.canvasInput.nativeElement).subscribe();

        }),
        tap(() => {

        })
      )
      .subscribe(() => {
      });
  }

  onStart() {
    this.isOpenedCamera = true;
    let video = document.getElementById('videoInput') as HTMLVideoElement;
    navigator.mediaDevices.getUserMedia({ video: true, audio: false })
      .then((stream) => {
        this.stream = stream;
        video.srcObject = stream;
        video.play();
      })
      .catch(function (err) {
        console.log('An error occurred! ' + err);
      });
    // let video = document.getElementById('videoInput') as HTMLVideoElement;
    this.src = new cv.Mat(video.height, video.width, cv.CV_8UC4);
    this.dst = new cv.Mat(video.height, video.width, cv.CV_8UC1);
    this.cap = new cv.VideoCapture(video);
    this.onStartCamera();
  }

  onCloseCamera() {
    this.isOpenedCamera = false;
    let video = document.getElementById('videoInput') as HTMLVideoElement;
    video.pause();
    video.src = null;
    this.stream.getTracks().forEach(element => {
      element.stop();
    });
  }

  onStartCamera() {
    setTimeout(() => { this.processVideo(); }, 0);
  }

  processVideo() {
    const FPS = 30;
    try {
      let begin = Date.now();
      // start processing.
      this.cap.read(this.src);
      cv.cvtColor(this.src, this.dst, cv.COLOR_RGBA2GRAY);
      cv.imshow('canvasInput', this.dst);
      // schedule the next one.
      let delay = 30000 / FPS - (Date.now() - begin);
      this.detectFace().subscribe(x => {
        setTimeout(() => { this.processVideo(); }, delay);
      });

    } catch (err) {
      console.log(err);
    }
  }

  readDataUrl(event) {
    if (event.target.files.length) {
      this.ngxPicaService.resizeImage(event.target.files[0], 300, 300,
        { aspectRatio: { keepAspectRatio: true, forceMinDimensions: true } }).subscribe(resizedImage => {
          const reader = new FileReader();
          const load$ = fromEvent(reader, 'load');
          load$
            .pipe(
              switchMap(() => {
                return this.ngOpenCVService.loadImageToHTMLCanvas(`${reader.result}`, this.canvasInput.nativeElement);
              })
            )
            .subscribe(
              () => { },
              err => {
                console.log('Error loading image', err);
              }
            );
          reader.readAsDataURL(resizedImage);
        });
    }
  }
  loadClassifiers(): Observable<any> {
    return forkJoin(
      this.ngOpenCVService.createFileFromUrl(
        // 'haarcascade_frontalface_default.xml',
        // `assets/opencv/data/haarcascades/haarcascade_frontalface_default.xml`
        'lbpcascade_frontalface_improved.xml',
        'assets/opencv/data/lbpcascades/lbpcascade_frontalface_improved.xml'
      ),
      this.ngOpenCVService.createFileFromUrl(
        'haarcascade_eye.xml',
        `assets/opencv/data/haarcascades/haarcascade_eye.xml`
      )
    );
  }

  detectFace() {
    return this.ngOpenCVService.isReady$
      .pipe(
        filter((result: OpenCVLoadResult) => result.ready),
        switchMap(() => {
          return this.classifiersLoaded$;
        }),
        tap(() => {
          this.clearOutputCanvas();
          this.findFaceAndEyes().subscribe(x => {
            console.log('Face of' + x);
            this.nameOfFace = { name: x }
            if (this.listStudent.indexOf(x) === -1 && x) {
              this.listStudent.push(x);
            }
          });
        })
      )
  }

  clearOutputCanvas() {
    const context = this.canvasOutput.nativeElement.getContext('2d');
    context.clearRect(0, 0, this.canvasOutput.nativeElement.width, this.canvasOutput.nativeElement.height);
  }

  findFaceAndEyes() {
    const subject = new Subject<string>();
    const src = cv.imread(this.canvasInput.nativeElement.id);
    const gray = new cv.Mat();
    cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY, 0);
    const faces = new cv.RectVector();
    const faceCascade = new cv.CascadeClassifier();
    faceCascade.load('lbpcascade_frontalface_improved.xml');
    // detect faces
    const msize = new cv.Size(0, 0);
    faceCascade.detectMultiScale(gray, faces, 1.1, 3, 0, msize, msize);
    for (let i = 0; i < faces.size(); ++i) {

      const roiGray = gray.roi(faces.get(i));
      const roiSrc = src.roi(faces.get(i));

      const point1 = new cv.Point(faces.get(i).x, faces.get(i).y);
      const point2 = new cv.Point(faces.get(i).x + faces.get(i).width, faces.get(i).y + faces.get(i).height);
      cv.rectangle(src, point1, point2, [255, 0, 0, 255]);

      const canvas: HTMLCanvasElement = this.document.createElement('canvas');
      canvas.width = point2.x - point1.x;
      canvas.height = point2.y - point1.y;
      cv.imshow(canvas, roiGray);
      cv.imshow('canvasFace', roiGray);
      canvas.toBlob(async (blob) => {
        const imageAsFile: any = blob;
        imageAsFile.lastModifiedDate = new Date();
        imageAsFile.name = 'image.jpeg';
        const name = await this.apiService.putFaceAndRecognize(imageAsFile).toPromise();
        subject.next(name);
      }, 'image/jpeg', 1);


      roiGray.delete();
      roiSrc.delete();
    }
    cv.imshow(this.canvasOutput.nativeElement.id, src);
    src.delete();
    gray.delete();
    faceCascade.delete();
    faces.delete();
    return subject;
  }

  getToday() {
    let currentDatetime = new Date();
    return currentDatetime.getDate() + "-" + (currentDatetime.getMonth() + 1) + "-" + currentDatetime.getFullYear();
  }
}
