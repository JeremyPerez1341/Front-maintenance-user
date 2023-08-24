import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { User } from 'src/app/models/user.model';
import { HttpDataService } from 'src/app/services/http-data.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent implements OnInit {

  displayedColumns: string[] = ['id', 'name', 'lastName', 'login', 'state', 'createdAt', 'updatedAt', 'actions'];
  usersData!: User;
  dataSource = new MatTableDataSource();

  @ViewChild(MatPaginator, { static: true })
  paginator!: MatPaginator;

  constructor(private httpDataService: HttpDataService, private datePipe: DatePipe) {
    this.usersData = {} as User;
  }

  ngOnInit(): void {
    this.dataSource.paginator = this.paginator;
    this.getAllUsers();
  }

  getAllUsers() {
    this.httpDataService.getList().subscribe((response: any) => {
      this.dataSource.data = response;
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
