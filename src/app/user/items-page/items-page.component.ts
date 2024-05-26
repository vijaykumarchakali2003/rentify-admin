import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-items-page',
  templateUrl: './items-page.component.html',
  styleUrls: ['./items-page.component.scss']
})
export class ItemsPageComponent implements OnInit {

  constructor(private http: HttpClient, private router: Router) { }

  item = {
    houseType: String,
    location: String,
    bedroomsNumber: Number,
    bathroomsNumber: Number,
    squareFootage: Number,
    cost: Number,
    parkingAre: String,
    nearHospital: String,
    nearSchool: String
  };
  items: any;
  userInfo: any;

  ngOnInit() {
    const x = localStorage.getItem('userInfo');
    if (!x) {
      this.router.navigateByUrl('/');
    }
    this.userInfo = JSON.parse(x);
    console.log(this.userInfo);
    this.getAllItems();
  }

  getAllItems() {
    const queryParams = { emailId: this.userInfo.emailId};
    this.http.get('http://localhost:8000/getAllItems', {params: queryParams}).subscribe( (data: any) => {
      console.log(data);
      this.items = data.allItems;
    });
  }

  intrested(item) {
    console.log(item);
    const obj = {
      productId: item._id,
      userMail: this.userInfo.emailId,
      houseType: item.houseType,
      location: item.location,
      bedroomsNumber: item.bedroomsNumber,
      bathroomsNumber: item.bathroomsNumber,
      cost: item.cost,
      nearHospital: item.nearHospital,
      nearSchool: item.nearSchool,
      sellerMail: item.sellerMail,
      parkingAre: item.parkingAre,
      squareFootage: item.squareFootage
    };

    this.http.post('http://localhost:8000/putIntrestedItems', obj).subscribe( (res: any) => {
      const data = res;
      if (data.message === 'Successfully Inserted the Intrested_Item') {
        alert('Successfully Inserted the Intrested_Item');
      } else {
        alert('Please Try again later');
      }
    });

    this.http.post('http://localhost:8000/sendMail', obj).subscribe( (res) => {
      alert('Please check your mail for more Details');
    });
  }

  filter(filterItems) {
    console.log(filterItems);
    const query = {
      // tslint:disable-next-line:radix
      byPrice: filterItems.byPrice,
      byLocation: filterItems.byLocation,
      // tslint:disable-next-line:radix
      byRoom: filterItems.byRoom
    };
    this.http.get('http://localhost:8000/getFilteredData', { params: query}).subscribe( (res: any) => {
      const x = res.data;
      console.log(res);
      this.items = x;
      if (!x) {
        alert('Data Not Available on the given Filter');
        // location.reload();
      }
    });
  }

}
