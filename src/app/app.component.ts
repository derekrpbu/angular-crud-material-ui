import { Component, OnInit, ViewChild } from '@angular/core';

import {MatDialog, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { DialogComponent } from './dialog/dialog.component';
import { ApiService } from './services/api.service';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  title = 'crud-angular-material';

  displayedColumns: string[] = ['productName', 'category', 'date', 'freshness', 'price', 'comment', 'action'];
  dataSource!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;  // declare paginator
  @ViewChild(MatSort) sort!: MatSort; // declare sort

  constructor(private dialog : MatDialog, private api : ApiService) {

  }

  ngOnInit(): void {
    this.getAllProducts()
  }

  openDialog() {
    this.dialog.open(DialogComponent, {
      width: '30%'
    }).afterClosed().subscribe( value => {
      if(value === 'save') {
        this.getAllProducts()   // Used to refresh table after closing dialog
      }
    })
  }

  getAllProducts() {
    this.api.getProducts()
    .subscribe({
      next:(res)=>{
        this.dataSource = new MatTableDataSource(res);  // we get DataSource
        this.dataSource.paginator = this.paginator  // init pagination
        this.dataSource.sort = this.sort  // init sort
      },
      error:()=>{
        alert("Error while fetching")
      }
    })
  }

  editProduct(row : any) {
    this.dialog.open(DialogComponent, {
      width: '30%',
      data: row //pass data of row
    }).afterClosed().subscribe(value => {
      if(value === 'update') {
        this.getAllProducts() // refresh table after editing
      }
    })
  }

  deleteProduct(id : number) {
    this.api.deleteProduct(id)
    .subscribe({
      next: (res) => {
        alert("Product Deleted Successfully")
        this.getAllProducts()   // refresh table after delete
      },
      error: () => {
        alert("Error while deleting the Product")
      }
    })
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}