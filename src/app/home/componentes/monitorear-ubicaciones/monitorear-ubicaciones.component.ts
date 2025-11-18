import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-monitorear-ubicaciones',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './monitorear-ubicaciones.component.html',
  styleUrls: ['./monitorear-ubicaciones.component.css']
})
export class MonitorearUbicacionesComponent implements OnInit {
  @Input() ubicaciones: string[] = [];

  ngOnInit(): void {}
}

