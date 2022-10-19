import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators} from '@angular/forms';
import { ApiService } from '../services/api.service';
import { MatDialogRef , MAT_DIALOG_DATA} from '@angular/material/dialog'

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss']
})
export class DialogComponent implements OnInit {

  freshnessList = ["Brand New", "Second Hand", "Refurbised"]

  productForm !: FormGroup; // Create Form

  actionBtn = "Save" // used to display save or update on form submit button

  constructor(
    // Injections in the Constructor
    private formBuilder : FormBuilder, 
    private api : ApiService, 
    private dialogRef : MatDialogRef<DialogComponent>,
    @Inject(MAT_DIALOG_DATA) public editData : any  // editData will have row value
    ) { }

  ngOnInit(): void {
    // Initialize and Group Form
    this.productForm = this.formBuilder.group({
      productName : ['', Validators.required], // add validation
      category : ['', Validators.required], 
      freshness : ['', Validators.required], 
      price : ['', Validators.required], 
      comment : ['', Validators.required],
      date : ['', Validators.required],
    })

    // receive data from row, apply it to Form (patch values)
    if(this.editData) {
      this.actionBtn = "Update"
      this.productForm.controls['productName'].setValue(this.editData.productName)
      this.productForm.controls['category'].setValue(this.editData.category)
      this.productForm.controls['freshness'].setValue(this.editData.freshness)
      this.productForm.controls['price'].setValue(this.editData.price)
      this.productForm.controls['comment'].setValue(this.editData.comment)
      this.productForm.controls['date'].setValue(this.editData.date)
    }

  }

  addProducts() {
    if(!this.editData) {
      if(this.productForm.valid) {
        this.api.postProduct(this.productForm.value)
        .subscribe({
          next: (res) => {
            alert("Product added successfully!");
            this.productForm.reset()
            this.dialogRef.close('save')
          },
          error: () => {
            alert("Error while adding Product!")
          }
        })
      }
    } else {
      this.updateProdcut()
    }
  }

  updateProdcut() {
    this.api.putProduct(this.productForm.value, this.editData.id)
    .subscribe({
      next: (res) => {
        alert("Product updated successfully")
        this.productForm.reset()
        this.dialogRef.close('update')
      },
      error: () => {
        alert("Error While Updating Product")
      }
    })
  }

}
