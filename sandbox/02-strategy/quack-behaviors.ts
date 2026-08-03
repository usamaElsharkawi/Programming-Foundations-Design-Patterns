import type { QuackBehavior } from "./interfaces.js";

export class Quack implements QuackBehavior {
    quack(): void{
        console.log("Quack")
    }
}


export class Squeak implements QuackBehavior{
    quack(): void{
        console.log("Squeak")
    }
}


export class MuteQuack implements QuackBehavior{
    quack():void{
                console.log("<silence> Mute")
    }
}