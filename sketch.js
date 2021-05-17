const Engine= Matter.Engine;
const World= Matter.World;
const Bodies = Matter.Bodies;

//Create variables here
var dog,happyDog;
var FoodS, lastFed,fedTime;
var database;
var foodObj,addFood,feed;
var dogName;
var button;

function preload(){
	dogImg=loadImage('images/dogImg.png');
  dogImg1=loadImage('images/dogImg1.png');
}

function setup() {
	createCanvas(700, 500);
  engine = Engine.create();
	world = engine.world;
    
  database=firebase.database();
  var foodStockRef=database.ref('Food');
  foodStockRef.on("value",readStock);
 
  var FeedTimeRef=database.ref('FeedTime');
  FeedTimeRef.on("value",readFeedTime);
  
  dog=createSprite(550,250,50,50);
  dog.addImage(dogImg);
  dog.scale=0.2;  
  foodObj = new Food();

  input = createInput("");
  input.position(820, 400);

  button = createButton("Press this Button after Giving the Name");
  button.position(780, 450);  
  console.log(input.value());
  

  button.mousePressed(()=> {
    input.hide();
    button.hide();
    dogName =input.value();
    database.ref('/').update({
      Name:dogName
    })
    console.log(dogName)
  
});

  feed = createButton("Feed the Dog");
  feed.position(500,60);
  feed.mousePressed(feedDog);

  addFood = createButton("Add Food");
  addFood.position(800,60);
  addFood.mousePressed(addFoods);
  
  Engine.run(engine);
}

function draw() {  
  background(46,139,87);
  
  foodObj.display();

  drawSprites();

  //add styles here
  fill("white");
  textSize(20);
  if(fedTime > 12) {
    text("Last Fed Time: " + fedTime%12 + " PM", 250,100);
  } else if (fedTime === 0) {
    text("Last Fed Time: 12 AM", 300,100);
  } else {
    text("Last Fed Time: " + fedTime + " AM", 250,100);
  }
  text(dogName,520,350)

  if (FoodS === 30) {
    textSize(15);
    text("Not enough Storage Space to add more Milk", 40,400);
  }
}

function readStock(data){
  FoodS=data.val();
  foodObj.getFoodStock(FoodS);
}

function readFeedTime(data){
  fedTime=data.val();
  foodObj.getLastFedTime(fedTime);
}

function feedDog(){
  
    dog.addImage(dogImg1);
    database.ref('/').update({
    Food:foodObj.deductFoodStock(),
    FeedTime:hour()
  })
}

function addFoods(){
  dog.addImage(dogImg);
  database.ref('/').update({ 
  Food:foodObj.updateFoodStock()
  })
}


