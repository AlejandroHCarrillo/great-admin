import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'images-gallery',
  templateUrl: './images-gallery.component.html',
  styleUrls: ['./images-gallery.component.css']
})
export class ImagesGalleryComponent implements OnInit {
  @Input('direction') direction: string = "m";
  @Input('title') title: string = "";
  @Input('pictures') pictures: string[] = [
    "https://res.cloudinary.com/alexthegreat/image/upload/v1615756794/zadq4trd4reeifah4gp1.jpg",
    "https://res.cloudinary.com/alexthegreat/image/upload/v1615756794/hdcwy8gt2fqqdf6gobaj.jpg",
    "https://res.cloudinary.com/alexthegreat/image/upload/v1615756794/wqdljkwzi2o1vdko64l1.jpg",
    "https://res.cloudinary.com/alexthegreat/image/upload/v1615756794/coksacuwzw2sdutjvjyh.jpg",
    "https://res.cloudinary.com/alexthegreat/image/upload/v1615756794/hfzoog2vdusekzldsmj6.jpg",
    "https://res.cloudinary.com/alexthegreat/image/upload/v1615756794/qyzufakym99edfirz8zj.jpg",
    "https://res.cloudinary.com/alexthegreat/image/upload/v1615756795/mpx9mryzbpfbdxpccovv.jpg",
    "https://res.cloudinary.com/alexthegreat/image/upload/v1615756795/tlrswiy7gxbch39fmgxs.jpg",
    "https://res.cloudinary.com/alexthegreat/image/upload/v1615756795/qnggifcj2ffcmufzmjab.jpg",
    "https://res.cloudinary.com/alexthegreat/image/upload/v1615756795/vxziaiue0ebnydaufvmt.jpg",
    "https://res.cloudinary.com/alexthegreat/image/upload/v1615756795/sxsp48ptkyyusx7h2dp9.jpg",
    "https://res.cloudinary.com/alexthegreat/image/upload/v1615756795/nymc5faqb6vk73icdcvc.jpg",
    "https://res.cloudinary.com/alexthegreat/image/upload/v1615756795/wqzngzbiqimx4nqiuvsb.jpg",
    "https://res.cloudinary.com/alexthegreat/image/upload/v1615756795/mb2wvqpuhoivrarrf3nt.jpg",
    "https://res.cloudinary.com/alexthegreat/image/upload/v1615756795/bmhlqbd0gfjks0kv85zb.jpg",
    "https://res.cloudinary.com/alexthegreat/image/upload/v1615756795/gnthsldu7gcu2rjume6h.jpg",
    "https://res.cloudinary.com/alexthegreat/image/upload/v1615756795/ngtggaa5qoj2j628oige.jpg",
    "https://res.cloudinary.com/alexthegreat/image/upload/v1615756795/l8ug616zhchp71yympu0.jpg",
    "https://res.cloudinary.com/alexthegreat/image/upload/v1615756795/gc9nr34by3a3hdb6k0ps.jpg",
    "https://res.cloudinary.com/alexthegreat/image/upload/v1615756795/wcecsbuujb7p6qnzhscx.jpg",
    "https://res.cloudinary.com/alexthegreat/image/upload/v1615756795/pza4lmbvynolzh4odyyt.jpg",
    "https://res.cloudinary.com/alexthegreat/image/upload/v1615756795/vxgixkte6i6ttaey45eu.jpg",
    "https://res.cloudinary.com/alexthegreat/image/upload/v1615756795/alrwm6bf33kaisgs2ml2.jpg",
    "https://res.cloudinary.com/alexthegreat/image/upload/v1615756796/ktmhhpw73o2izhzpnnt8.jpg",
    "https://res.cloudinary.com/alexthegreat/image/upload/v1615756796/rpdrfowateecbd8tm0r7.jpg",
    "https://res.cloudinary.com/alexthegreat/image/upload/v1615756796/apd3ymv7wwqytznbsbfi.jpg",
    "https://res.cloudinary.com/alexthegreat/image/upload/v1615756796/ah2hjigyovtrxi9ktfh9.jpg",
    "https://res.cloudinary.com/alexthegreat/image/upload/v1615756796/et27aufdptgirfsimy9g.jpg",
    "https://res.cloudinary.com/alexthegreat/image/upload/v1615756796/kja4muwgmjesl71dmklv.jpg",
    "https://res.cloudinary.com/alexthegreat/image/upload/v1615756796/opsildvmlimiqsznhcqp.jpg",
    "https://res.cloudinary.com/alexthegreat/image/upload/v1615756796/z3n5u6u6xtvmsfdmylzb.jpg",
    "https://res.cloudinary.com/alexthegreat/image/upload/v1615756796/zph1vtsr7l6hss1mag4w.jpg",
    "https://res.cloudinary.com/alexthegreat/image/upload/v1615756796/eql6s9k2z2ja7ro29nxe.jpg",
    "https://res.cloudinary.com/alexthegreat/image/upload/v1615756796/rztuiwrexfrzdjgk43iv.jpg",
    "https://res.cloudinary.com/alexthegreat/image/upload/v1615756796/cqfxh7vcnbpaf0em5zal.jpg",
    "https://res.cloudinary.com/alexthegreat/image/upload/v1615756796/e4993oqnlhrayechvdco.jpg",
    "https://res.cloudinary.com/alexthegreat/image/upload/v1615756796/ltrfyblbi5x8cderwjak.jpg",
    "https://res.cloudinary.com/alexthegreat/image/upload/v1615756796/r83panwueygkbmbzjaax.jpg",
    "https://res.cloudinary.com/alexthegreat/image/upload/v1615756796/djqzisyagsdg9bma94t4.jpg",
    "https://res.cloudinary.com/alexthegreat/image/upload/v1615756796/ejjww5uzsx6dqensgi8l.jpg",
    "https://res.cloudinary.com/alexthegreat/image/upload/v1615756797/vizjfqemcglpn1xrmdk6.jpg",
    "https://res.cloudinary.com/alexthegreat/image/upload/v1615756797/rdeuc4xcqtfud34otwwi.jpg",
    "https://res.cloudinary.com/alexthegreat/image/upload/v1615756797/r57h6o1p4cgt7ljgu8p7.jpg",
    "https://res.cloudinary.com/alexthegreat/image/upload/v1615756797/qmxff6pdwhjdztwxuzny.jpg",
    "https://res.cloudinary.com/alexthegreat/image/upload/v1615756797/mn19usdmqcucnhdtdahc.jpg",
    "https://res.cloudinary.com/alexthegreat/image/upload/v1615756797/qbya9obo41xo9pmsaxht.jpg",
    "https://res.cloudinary.com/alexthegreat/image/upload/v1615756797/jrzdhffpglclvrinelhk.jpg",
    "https://res.cloudinary.com/alexthegreat/image/upload/v1615756797/bjnuo1tbst8o2k0n36c8.jpg"
  ];
  
  currentImage: string = "";

  constructor() { }

  ngOnInit(): void {
  }

  setCurrentImg(url: string){
    this.currentImage = url;
  }
}