
window.addEventListener('load', function(){
    const canvas = this.document.getElementById('canvas1');
    const ctx = canvas.getContext('2d');
    canvas.width = 1280;
    canvas.height = 720;

    ctx.fillStyle = 'white';
    ctx.lineWidth = 3;
    ctx.strokeStyle = 'black';
    ctx.font = '40px Bangers';
    ctx.textAlign = 'center';





    class Player {
        constructor(game){
            this.game = game;//convert it to a class property
            this.collisionX = this.game.width * 0.5;//game.width는 밑에 Game class에서 전달받는듯하다
            this.collisionY = this.game.height * 0.5;
            this.collisionRadius = 30;
            this.speedX=0;
            this.speedY =0;
            this.dx = 0;
            this.dy = 0;
            this.speedModifier = 5;
            this.spriteWidth = 255;
            this.spriteHeight = 256;
            this.width = this.spriteWidth;
            this.height = this.spriteHeight;
            this.spriteX;
            this.spriteY;
            this.frameX=0;
            this.frameY=5;
            this.image = document.getElementById('bull')

        }
        restart(){
            this.collisionX = this.game.width * 0.5;
            this.collisionY = this.game.height * 0.5;
            this.spriteX = this.collisionX - this.width *0.5;
            this.spriteY = this.collisionY - this.height*0.5 -100;

        }
        draw(context){
            context.drawImage(this.image, this.frameX * this.spriteWidth,this.frameY *this.spriteHeight, this.spriteWidth,this.spriteHeight,  this.spriteX,this.spriteY, this.width, this.height)
            if (this.game.debug){
                context.beginPath();
                context.arc(this.collisionX,this.collisionY,this.collisionRadius,0, Math.PI *2); //x, y, radius, starting angle, ending angle
                context.save();
                context.globalAlpha = 0.5;
                context.fill();
                context.restore(); //by wrapping the code between save and restore otherwise, everything drawn after that will be semi-transparent
                context.stroke();
                context.beginPath();
                context.moveTo(this.collisionX,this.collisionY);
                context.lineTo(this.game.mouse.x, this.game.mouse.y);
                context.stroke();
            }
        }
        update(){
            this.dx = this.game.mouse.x - this.collisionX;
            this.dy = this.game.mouse.y - this.collisionY;
            // sprite animation
            const angle =Math.atan2(this.dy, this.dx);
            if (angle <-2.74 || angle > 2.74) this.frameY = 6;
            else if (angle < -1.96) this.frameY = 7;
            else if (angle < -1.17) this.frameY = 0;
            else if (angle < -0.39) this.frameY = 1;
            else if (angle < 0.39) this.frameY = 2;
            else if (angle < 1.17) this.frameY = 3 ;
            else if (angle < 1.96) this.frameY = 4;
            else if (angle < 2.74) this.frameY = 5;
  
           
           

            const distance = Math.hypot(this.dx,this.dy);
            if(distance > this.speedModifier) {
                this.speedX = this.dx/distance || 0;
                this.speedY = this.dy/distance || 0;
            } else {
                this.speedX =  0;
                this.speedY = 0;
            }
            this.collisionX += this.speedX * this.speedModifier ;
            this.collisionY += this.speedY * this.speedModifier;
            this.spriteX = this.collisionX - this.width *0.5;
            this.spriteY = this.collisionY - this.height*0.5 -100;
            // horizontal boundaries
            if (this.collisionX < this.collisionRadius) this.collisionX = this.collisionRadius;
            else if (this.collisionX > this.game.width-this.collisionRadius) this.collisionX = this.game.width - this.collisionRadius;
            //vertical boundaries
            if(this.collisionY<this.game.topMargin + this.collisionRadius) this.collisionY = this.game.topMargin + this.collisionRadius;
            else if(this.collisionY > this.game.height - this.collisionRadius) this.collisionY = this.game.height - this.collisionRadius;
            // collision with obstacles
            this.game.obstacles.forEach(obstacle =>{
                //[(distance < sumOfRadii), distance, sumOfRadii, dx,dy]
                let [collision, distance, sumOfRadii, dx,dy] = this.game.checkCollision(this, obstacle);
                //let collision = game.checkCollision(this,obstacle)[0];
                //let distance = game.checkCollision(this,obstacle)[1];and so on
                if(collision){
                    const unit_x = dx / distance;
                    const unit_y = dy / distance;
                    this.collisionX = obstacle.collisionX + (sumOfRadii +1)*unit_x;
                    this.collisionY = obstacle.collisionY + (sumOfRadii +1)*unit_y;
                }
                //collision code. very important




            })

        }

    }


    class Obstacle {
        constructor(game){
            this.game = game;
            this.collisionX = Math.random() * this.game.width;
            this.collisionY = Math.random() * this.game.height;
            this.collisionRadius = 40;
            this.image = document.getElementById('obstacles')
            this.spriteWidth = 250;
            this.spriteHeight = 250;
            this.width = this.spriteWidth;
            this.height = this.spriteHeight;
            this.spriteX = this.collisionX - this.width*0.5;
            this.spriteY = this.collisionY - this.height*0.5 -70;
            this.frameX = Math.floor(Math.random()*4);
            this.frameY = Math.floor(Math.random()*3)
        }
        
        draw(context){
            context.drawImage(this.image, this.frameX * this.spriteWidth, this.frameY  * this.spriteHeight, this.spriteWidth, this.spriteHeight, this.spriteX, this.spriteY , this.width, this.height);
            if (this.game.debug){
                context.beginPath();
                context.arc(this.collisionX,this.collisionY,this.collisionRadius,0, Math.PI *2); //x, y, radius, starting angle, ending angle
                context.save();
                context.globalAlpha = 0.5;
                context.fill();
                context.restore(); //by wrapping the code between save and restore otherwise, everything drawn after that will be semi-transparent
                context.stroke();
            }
        }
        update(){

        }
    }

    class Egg {
        constructor (game){
            this.game = game;
            this.collisionRadius = 40;
            this.margin = this.collisionRadius *2;
            this.collisionX = this.margin + (Math.random()*this.game.width-this.margin*2);
            this.collisionY = this.game.topMargin + (Math.random()*(this.game.height-this.game.topMargin - this.margin));           
            this.image = document.getElementById('egg')
            this.spriteWidth = 110;
            this.spriteHeight = 135;
            this.width = this.spriteWidth;
            this.height = this.spriteHeight;
            this.spriteX;
            this.spriteY;
            this.hatchTimer = 0;
            this.hatchInterval = 3000;
            this.markedForDeletion = false;
        }
        draw(context){
            context.drawImage(this.image, this.spriteX, this.spriteY);
            if (this.game.debug){
                context.beginPath();
                context.arc(this.collisionX,this.collisionY,this.collisionRadius,0, Math.PI *2); //x, y, radius, starting angle, ending angle
                context.save();
                context.globalAlpha = 0.5;
                context.fill();
                context.restore(); //by wrapping the code between save and restore otherwise, everything drawn after that will be semi-transparent
                context.stroke();
                const displayTimer = (this.hatchTimer * 0.001).toFixed(0);//toFixed method converts a number to a string and it rounds ths string to a specified number of decimals

                context.fillText(displayTimer, this.collisionX, this.collisionY -this.collisionRadius*2.5);
            }
        }
        update(deltaTime){
            this.spriteX = this.collisionX - this.width*0.5;
            this.spriteY = this.collisionY - this.height*0.5 -30;
            //collision
            let collisionObjects = [this.game.player, ...this.game.obstacles, ...this.game.enemies];
            //spread operator(...) allows us to quickly expand elements in an array into another array
            collisionObjects.forEach(object => {
                let [collision, distance, sumOfRadii, dx,dy] = this.game.checkCollision(this, object);
                if(collision){
                    const unit_x = dx/distance;
                    const unit_y = dy/distance;
                    this.collisionX = object.collisionX + (sumOfRadii + 1)*unit_x;
                    this.collisionY = object.collisionY + (sumOfRadii + 1)*unit_y;
                }
            });
            // hatching
            if(this.hatchTimer > this.hatchInterval || this.collisionY < this.game.topMargin){
                this.game.hatchlings.push(new Larva(this.game, this.collisionX, this.collisionY));
                this.markedForDeletion = true;
                this.game.removeGameObjects();
                console.log(this.game.eggs)
            } else {
                this.hatchTimer += deltaTime; 
            }
        }
    }
    class Larva {
        constructor(game, x, y){
            this.game = game;
            this.collisionX = x;
            this.collisionY = y;
            this.collisionRadius = 30;
            this.image = document.getElementById('larva')
            this.spriteWidth = 150;
            this.spriteHeight = 150;
            this.width = this.spriteWidth;
            this.height = this.spriteHeight;
            this.spriteX;
            this.spriteY;
            this.speedY = 1 + Math.random();
            this.frameX = 0;
            this.frameY = Math.floor(Math.random() *2)
        }
        draw(context){
            context.drawImage(
                this.image,                // 이미지 소스
                this.frameX * this.spriteWidth, this.frameY * this.spriteHeight,              // 이미지의 시작 X 좌표, 이미지의 시작 Y 좌표
                this.spriteWidth,             // 이미지의 너비
                this.spriteHeight,            // 이미지의 높이
                this.spriteX,                 // 그려질 위치의 X 좌표
                this.spriteY,                 // 그려질 위치의 Y 좌표
                this.width,   // 그려질 부분의 너비 (생략 가능)
                this.height   // 그려질 부분의 높이 (생략 가능) 근데 생략 안됨;;
            );
            if (this.game.debug){
                context.beginPath();
                context.arc(this.collisionX,this.collisionY,this.collisionRadius,0, Math.PI *2); //x, y, radius, starting angle, ending angle
                context.save();
                context.globalAlpha = 0.5;
                context.fill();
                context.restore(); //by wrapping the code between save and restore otherwise, everything drawn after that will be semi-transparent
                context.stroke();
            }

        }
        update(){
            this.collisionY -= this.speedY
            this.spriteX = this.collisionX - this.width * 0.5;
            this.spriteY = this.collisionY - this.height * 0.5 - 40;
            //move to safety
            if (this.collisionY < this.game.topMargin){
                this.markedForDeletion = true;
                this.game.removeGameObjects();
                if(!this.game.gameOver) this.game.score++;
                for (let i = 0; i < 3; i++){
                    this.game.particles.push(new Firefly(this.game, this.collisionX, this.collisionY, 'yellow'));                    
                }


            
            }
            //collision with objects
            let collisionObjects = [this.game.player, ...this.game.obstacles, ...this.game.eggs];
            //spread operator(...) allows us to quickly expand elements in an array into another array
            collisionObjects.forEach(object => {
                let [collision, distance, sumOfRadii, dx,dy] = this.game.checkCollision(this, object);
                if(collision){
                    const unit_x = dx/distance;
                    const unit_y = dy/distance;
                    this.collisionX = object.collisionX + (sumOfRadii + 1)*unit_x;
                    this.collisionY = object.collisionY + (sumOfRadii + 1)*unit_y;
                }
            });
            //collision with enemies
            this.game.enemies.forEach(enemy => {
                if(this.game.checkCollision(this, enemy)[0] && !this.game.gameOver){
                    this.markedForDeletion = true;
                    this,game.removeGameObjects();
                    this.game.lostHatchlings++;
                    for (let i = 0; i < 5; i++){
                        this.game.particles.push(new Spark(this.game, this.collisionX, this.collisionY, 'blue'));                    
                    }

                }
            });

        }
    }
    class Enemy {
        constructor(game){
            this.game = game;
            this.collisionRadius = 30;
            this.speedX = Math.random() * 3+0.5
            this.image = document.getElementById('toads')
            this.spriteWidth = 140;
            this.spriteHeight = 260;
            this.width = this.spriteWidth;
            this.height = this.spriteHeight;
            this.collisionX = this.game.width + this.width + Math.random()*this.game.width * 0.5;
            this.collisionY = this.game.topMargin + (Math.random() * (this.game.height - this.game.topMargin));
            this.spriteX;
            this.spriteY;
            this.frameX = 0;
            this.frameY = Math.floor(Math.random()*4);
        }
        draw(context){
            context.drawImage(this.image, this.frameX * this.spriteWidth, this.frameY * this.spriteHeight,  this.spriteWidth, this.spriteHeight, this.spriteX, this.spriteY, this.width, this.height);
            if (this.game.debug){
                context.beginPath();
                context.arc(this.collisionX,this.collisionY,this.collisionRadius,0, Math.PI *2); //x, y, radius, starting angle, ending angle
                context.save();
                context.globalAlpha = 0.5;
                context.fill();
                context.restore(); //by wrapping the code between save and restore otherwise, everything drawn after that will be semi-transparent
                context.stroke();
            }
        }
        update(){
            this.spriteX = this.collisionX - this.width*0.5;
            this.spriteY = this.collisionY - this.height*0.5 -90;
            this.collisionX -= this.speedX
            if(this.spriteX + this.width < 0 && !this.game.gameOver) {
                this.collisionX = this.game.width + this.width + Math.random()*this.game.width * 0.5;
                this.collisionY = this.game.topMargin + (Math.random() * (this.game.height - this.game.topMargin));       
                this.frameY = Math.floor(Math.random()*4);         
            }
            let collisionObjects = [this.game.player, ...this.game.obstacles];
            //spread operator(...) allows us to quickly expand elements in an array into another array
            collisionObjects.forEach(object => {
                let [collision, distance, sumOfRadii, dx,dy] = this.game.checkCollision(this, object);
                if(collision){
                    const unit_x = dx/distance;
                    const unit_y = dy/distance;
                    this.collisionX = object.collisionX + (sumOfRadii + 1)*unit_x;
                    this.collisionY = object.collisionY + (sumOfRadii + 1)*unit_y;
                }
            })
        }
    }
    class Particle {//Parent class(supper class)
        constructor(game, x, y, color){
            this.game = game;
            this.collisionX = x;
            this.collisionY = y;
            this.color = color;
            this.radius = Math.floor(Math.random() * 10 + 5) //using random method is performance expensive. one way of avoid this would be a technique called object pooling. you create a pool of particle objects and only draw them and use them when you need it
            this.speedX = Math.random()*6 - 3;
            this.speedY = Math.random()*2 + 0.5;
            this.angle = 0;
            this.va = Math.random() *0.1 +0.01;
            this.markedForDeletion = false;
        }
        draw(context){
            context.save();
            context.fillStyle = this.color;
            context.beginPath();
            context.arc(this.collisionX, this.collisionY, this.radius, 0, Math.PI *2);
            context.fill();
            context.stroke();
            context.restore();
        }
    }
    class Firefly extends Particle {//child class(sub class)
        update(){
            this.angle += this.va;
            this.collisionX += Math.cos(this.angle)*this.speedX; // particle의 수평 흔들림 모션 추가
            this.collisionX += this.speedX;
            this.collisionY -= this.speedY;
            if(this.collisionY < 0 -this.radius){
                this.markedForDeletion = true;
                this.game.removeGameObjects();
            }
        }

    }
    class Spark extends Particle {
        update(){
            this.angle += this.va * 0.5;
            this.collisionX -= Math.sin(this.angle)* this.speedX;
            this.collisionY -= Math.cos(this.angle)* this.speedY;
            if(this.radius > 0.1) this.radius -= 0.05;
            if(this.radius < 0.2){
                this.markedForDeletion = true;
                this.game.removeGameObjects();
            }
            
        }

    }


    class Game {
        constructor(canvas){
            this.canvas = canvas;
            this.width = this.canvas.width;
            this.height = this.canvas.height;
            this.topMargin = 260;
            this.debug = false;
            this.player = new Player(this);//Game class의 모든 'this'를 Player class에 전달 하는듯?
            this.fps = 120;
            this.timer = 0;
            this.interval = 1000/this.fps;
            this.eggTimer = 0;
            this.eggInterval = 500;
            this.numberOfObstacles = 10;
            this.maxEggs = 5;
            this.obstacles = [];
            this.eggs = [];
            this.enemies = [];
            this.hatchlings = [];
            this.particles = [];
            this.gameObjects = [];
            this.score = 0;
            this.winningScore = 10;
            this.gameOver = false;
            this.lostHatchlings = 0;
            this.mouse = {
                x:this.width * 0.5,
                y:this.height * 0.5,
                pressed:false
            }

            //event listeners
            //ES6 arrow functions is that they automatically inherit the reference to "this" keyword from the parent scope
            canvas.addEventListener('mousedown', e => {
                this.mouse.x = e.offsetX;
                this.mouse.y = e.offsetY;
                this.mouse.pressed = true;  
            })
            canvas.addEventListener('mouseup', e => {
                this.mouse.x = e.offsetX;
                this.mouse.y = e.offsetY;
                this.mouse.pressed = false;  
            });
            canvas.addEventListener('mouseup', e => {
                this.mouse.x = e.offsetX;
                this.mouse.y = e.offsetY;
                this.mouse.pressed = false;  
            });
            canvas.addEventListener('mousemove', e => {
                if (this.mouse.pressed) {
                    this.mouse.x = e.offsetX;
                    this.mouse.y = e.offsetY;
                }                           
            })
            window.addEventListener('keydown', e =>{
                if(e.key=='b') this.debug = !this.debug;
                else if(e.key=='r') this.restart();
            })
        }
        render(context, deltaTime){ 
            if(this.timer > this.interval){
                //animate next frame
                context.clearRect(0,0,this.width,this.height)
                this.gameObjects = [...this.eggs, ...this.obstacles, this.player, ...this.enemies, ...this.hatchlings, ...this.particles];
                 //sort by vertical position
                this.gameObjects.sort((a, b) => {
                return a.collisionY - b.collisionY;
                });
                this.gameObjects.forEach(object => {
                    object.draw(context);
                    object.update(deltaTime);
                });

                this.timer = 0;                
            }
            this.timer += deltaTime; // deltaTime is undifined..? it works somehow. FPS lecture
            
            //add eggs periodically
            if (this. eggTimer > this.eggInterval && this.eggs.length < this.maxEggs && !this.gameOver){ 
                this.addEgg();
                this.eggTimer = 0;
            } else {
                this.eggTimer += deltaTime
            }
            //draw status text
            context.save();
            context.textAlign = 'left';
            context.fillText('score: '+this. score , 25,50);
            if (this.debug) {
                context.fillText('Lost: ' + this.lostHatchlings, 25, 100)
            }
            context.restore();

            //win / lose message
            if(this.score >= this.winningScore){
                this.gameOver = true; 
                context.save();
                context.fillStyle = 'rgba(0,0,0,0.5)';
                context. fillRect(0, 0, this.width, this.height);
                context.fillStyle = 'white';
                context.textAlign = 'center';
                context.shadowOffsetX = 4;
                context.shadowOffsetY = 4;
                context.shadowColor = 'black';
                let message1;
                let message2;
                if (this.lostHatchlings <= 5){
                    message1 = 'Bullseye!!!'
                    message2 = 'You bullied the bullies';                    
                } else {
                    message1 = 'Bullocks!!!'
                    message2 = 'You lost' + this.lostHatchlings + "hatchlings, don't be a pushover!";
                }
                context.font = '130px Bangers';
                context.fillText(message1, this.width * 0.5, this.height * 0.5 - 30);
                context.font = '40px Bangers';
                context.fillText(message2, this.width * 0.5, this.height * 0.5 + 30);
                context.fillText("Final score " + this.score + ". Press 'R' to butt heads again!", this.width * 0.5, this.height * 0.5 + 80);
                context.restore();           

            }

        }
        checkCollision(a,b){
            const dx = a.collisionX - b.collisionX
            const dy = a.collisionY - b.collisionY
            const distance = Math.hypot(dy,dx);
            const sumOfRadii = a.collisionRadius + b.collisionRadius;
            return [(distance < sumOfRadii), distance, sumOfRadii, dx,dy];
        }
        addEgg(){
            this.eggs.push(new Egg(this))
        }
        addEnemy(){
            this.enemies.push(new Enemy(this));
        }
        removeGameObjects(){
            this.eggs = this.eggs.filter(object => !object.markedForDeletion);
            this.hatchlings = this.hatchlings.filter(object => !object.markedForDeletion);  
            this.particles = this.particles.filter(object => !object.markedForDeletion);
        }
        restart(){
            this.player.restart();
            this.obstacles = [];
            this.eggs = [];
            this.enemies = [];
            this.hatchlings = [];
            this.particles = [];
            this.mouse = {
                x:this.width * 0.5,
                y:this.height * 0.5,
                pressed:false
            }
            this.score = 0;
            this.lostHatchlings = 0;
            this.gameOver = false;
            this.Init();
        }
        Init(){
            for (let i = 0; i < 5; i++){
                this.addEnemy();
            }
            let attempts = 0;
            while (this.obstacles.length < this.numberOfObstacles && attempts < 500) { 
                let testObsticle = new Obstacle(this);
                let overlap = false;
                this.obstacles.forEach(obstacle => {
                    const dx = testObsticle.collisionX - obstacle.collisionX
                    const dy = testObsticle.collisionY - obstacle.collisionY
                    const distance = Math.hypot(dy,dx);
                    const distanceBuffer = 150;
                    const sumOfRadii = testObsticle.collisionRadius + obstacle.collisionRadius + distanceBuffer;
                    if (distance < sumOfRadii){
                        overlap = true;
                    }
                });
                const margin = testObsticle.collisionRadius*3;

                if (!overlap &&testObsticle.spriteX > 0 && testObsticle.spriteX<this.width-testObsticle.width && testObsticle.collisionY > this.topMargin + margin && testObsticle.collisionY < this.height -margin ){
                    this.obstacles.push(testObsticle)
                    
                }
                attempts++;

            }
        

        }

    }


    

    const game = new Game(canvas); //여길 통해 this.game = game이 작동
    game.Init();

    
    let lastTime = 0;    
    function animate(timeStamp){
        const deltaTime = timeStamp - lastTime;        
        lastTime = timeStamp;
        //console.log(deltaTime)

        game.render(ctx,deltaTime);
        requestAnimationFrame(animate);
    }

    animate(0);
})