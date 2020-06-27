
let express=require("express");
let app=express();
let bodyParser=require("body-parser");

let campgrounds=[
    {
        name: "Salmon Creek",
        img: "https://50campfires.com/wp-content/uploads/2016/06/540x360-1.jpg"
    },
    {
        name: "Seattle creek",
        img: "https://res.cloudinary.com/fittco/image/upload/w_720,f_auto/lhrtrjztpni3csgykywe.jpg"
    },
    {
        name: "Toronto farm",
        img: "https://static.workaway.info/gfx/foto/4/2/4/2/3/424237449839/thumb/424237449839_154463778706673.jpg"
    }
]

app.use(bodyParser.urlencoded({extended: true}))
app.set("view engine","ejs");

app.get("/",(req,res)=>{
    res.render("landing");
})

app.get("/campgrounds",(req,res)=>{
    res.render("campgrounds",{campgrounds:campgrounds});
})

app.get("/campgrounds/new",(req,res)=>{
    res.render("form");
})

app.post("/campgrounds",(req,res)=>{
    let name=req.body.name;
    let image=req.body.image;
    let camp={
        name:name,
        img:image
    }
    campgrounds.push(camp);
    res.redirect("/campgrounds");
})


app.listen(3000,()=>{
    console.log("Yelpcamp running on port 3000!");
})